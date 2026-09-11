import React from "react";
import { useQuery } from "@tanstack/react-query";

import {
    CalendarDays,
    Clock3,
    Moon,
    Sun,
    Sunrise,
    Sunset,
    BookOpen,
    HandHeart,
    Info,
} from "lucide-react";

import { fetchPrayerTimes } from "../api/prayerApi";

const rakaatData = [
    {
        name: "Fajr",
        subtitle: "Dawn",
        icon: Sunrise,
        before: 2,
        fard: 2,
        after: "-",
        nafl: "-",
        total: 4,
        color: "text-sky-700",
        bg: "bg-sky-50",
    },
    {
        name: "Dhuhr",
        subtitle: "Noon",
        icon: Sun,
        before: 4,
        fard: 4,
        after: 2,
        nafl: "-",
        total: 12,
        color: "text-green-700",
        bg: "bg-green-50",
    },
    {
        name: "Asr",
        subtitle: "Afternoon",
        icon: Sun,
        before: 4,
        fard: 4,
        after: "-",
        nafl: "-",
        total: 8,
        color: "text-orange-600",
        bg: "bg-orange-50",
    },
    {
        name: "Maghrib",
        subtitle: "After Sunset",
        icon: Sunset,
        before: "-",
        fard: 3,
        after: 2,
        nafl: "-",
        total: 7,
        color: "text-pink-700",
        bg: "bg-pink-50",
    },
    {
        name: "Isha",
        subtitle: "Night",
        icon: Moon,
        before: 4,
        fard: 4,
        after: 2,
        nafl: 3,
        total: 17,
        color: "text-purple-700",
        bg: "bg-purple-50",
    },
];

const prayerKeys = {
    Fajr: "Fajr",
    Dhuhr: "Dhuhr",
    Asr: "Asr",
    Maghrib: "Maghrib",
    Isha: "Isha",
};

function PrayerRakaat() {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["prayer-times"],
        queryFn: fetchPrayerTimes,
    });

    if (isLoading) {
        return (
            <section className="mx-auto max-w-7xl p-4">
                <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                    <Clock3 className="mx-auto mb-3 h-8 w-8 animate-pulse text-emerald-700" />

                    <p className="text-gray-600">
                        Loading prayer times...
                    </p>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="mx-auto max-w-7xl p-4">
                <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
                    <p className="font-medium text-red-700">
                        {error.message}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-7xl px-4 py-8">

            {/* ================= HEADER ================= */}

            <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div>
                    <p className="mb-1 text-sm font-bold uppercase tracking-[3px] text-amber-600">
                        Daily Salah
                    </p>

                    <h2 className="font-serif text-4xl font-bold capitalize text-emerald-900 md:text-5xl">
                        5 Daily Prayers
                    </h2>

                    <p className="mt-2 font-medium text-amber-700">
                        Raka'at (Units) in Each Prayer
                    </p>
                </div>

                {/* Location / Date */}

                <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">

                    <CalendarDays className="h-8 w-8 text-emerald-700" />

                    <div>
                        <p className="text-sm font-semibold text-emerald-900">
                            Today's Salah
                        </p>

                        <p className="text-xs text-gray-500">
                            {data?.date?.readable || "Today"}
                        </p>
                    </div>

                </div>
            </div>


            {/* ================= TABLE ================= */}

            <div className="overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[850px] border-collapse">

                        {/* TABLE HEADER */}

                        <thead>
                            <tr className="text-white">

                                <th className="bg-emerald-900 px-6 py-5 text-left">
                                    Prayer
                                </th>

                                <th className="bg-green-700 px-4 py-5 text-center">
                                    <span className="block font-bold">
                                        Sunnat
                                    </span>

                                    <span className="text-xs font-normal opacity-90">
                                        Before
                                    </span>
                                </th>

                                <th className="bg-blue-600 px-4 py-5 text-center">
                                    <span className="block font-bold">
                                        Fard
                                    </span>

                                    <span className="text-xs font-normal opacity-90">
                                        Obligatory
                                    </span>
                                </th>

                                <th className="bg-orange-600 px-4 py-5 text-center">
                                    <span className="block font-bold">
                                        Sunnat
                                    </span>

                                    <span className="text-xs font-normal opacity-90">
                                        After
                                    </span>
                                </th>

                                <th className="bg-purple-700 px-4 py-5 text-center">
                                    <span className="block font-bold">
                                        Nafl
                                    </span>

                                    <span className="text-xs font-normal opacity-90">
                                        Recommended
                                    </span>
                                </th>

                                <th className="bg-emerald-800 px-4 py-5 text-center">
                                    <span className="block font-bold">
                                        Total
                                    </span>

                                    <span className="text-xs font-normal opacity-90">
                                        Raka'at
                                    </span>
                                </th>

                            </tr>
                        </thead>


                        {/* TABLE BODY */}

                        <tbody>

                            {rakaatData.map((prayer, index) => {

                                const Icon = prayer.icon;

                                const prayerTime =
                                    data?.timings?.[prayerKeys[prayer.name]];

                                return (
                                    <tr
                                        key={prayer.name}
                                        className={`border-b border-gray-100 transition hover:bg-gray-50 ${index === rakaatData.length - 1
                                                ? "border-b-0"
                                                : ""
                                            }`}
                                    >

                                        {/* Prayer */}

                                        <td className="px-6 py-5">

                                            <div className="flex items-center gap-4">

                                                <div
                                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${prayer.bg}`}
                                                >
                                                    <Icon
                                                        className={`h-6 w-6 ${prayer.color}`}
                                                    />
                                                </div>

                                                <div>

                                                    <h3
                                                        className={`text-xl font-bold uppercase ${prayer.color}`}
                                                    >
                                                        {prayer.name}
                                                    </h3>

                                                    <p className="text-sm text-gray-500">
                                                        {prayer.subtitle}
                                                    </p>

                                                    {/* API Prayer Time */}

                                                    <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-700">

                                                        <Clock3 className="h-3 w-3" />

                                                        {prayerTime || "--:--"}

                                                    </div>

                                                </div>

                                            </div>

                                        </td>


                                        {/* Before */}

                                        <td className="px-4 py-5 text-center">

                                            <p className="text-2xl font-bold text-gray-800">
                                                {prayer.before}
                                            </p>

                                            {prayer.before !== "-" && (
                                                <span className="text-xs text-gray-500">
                                                    Sunnat
                                                </span>
                                            )}

                                        </td>


                                        {/* Fard */}

                                        <td className="px-4 py-5 text-center">

                                            <p className="text-2xl font-bold text-blue-700">
                                                {prayer.fard}
                                            </p>

                                        </td>


                                        {/* After */}

                                        <td className="px-4 py-5 text-center">

                                            <p className="text-2xl font-bold text-gray-800">
                                                {prayer.after}
                                            </p>

                                            {prayer.after !== "-" && (
                                                <span className="text-xs text-gray-500">
                                                    Sunnat
                                                </span>
                                            )}

                                        </td>


                                        {/* Nafl */}

                                        <td className="px-4 py-5 text-center">

                                            <p className="text-2xl font-bold text-gray-800">
                                                {prayer.nafl}
                                            </p>

                                            {prayer.nafl !== "-" && (
                                                <span className="text-xs text-gray-500">
                                                    Witr
                                                </span>
                                            )}

                                        </td>


                                        {/* Total */}

                                        <td className="bg-emerald-50 px-4 py-5 text-center">

                                            <p className="text-3xl font-bold text-emerald-900">
                                                {prayer.total}
                                            </p>

                                            <span className="text-xs text-gray-500">
                                                Raka'at
                                            </span>

                                        </td>

                                    </tr>
                                );
                            })}

                        </tbody>

                    </table>

                </div>
            </div>


            {/* ================= INFO CARDS ================= */}

            <div className="mt-6 grid gap-4 md:grid-cols-3">

                {/* Card 1 */}

                <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">

                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
                        <BookOpen className="h-6 w-6 text-emerald-700" />
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-emerald-900">
                        About Salah
                    </h3>

                    <p className="text-sm leading-6 text-gray-600">
                        Salah is one of the most important acts of worship.
                        Try to perform your daily prayers consistently.
                    </p>

                </div>


                {/* Card 2 */}

                <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">

                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
                        <HandHeart className="h-6 w-6 text-emerald-700" />
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-emerald-900">
                        Benefits
                    </h3>

                    <p className="text-sm leading-6 text-gray-600">
                        Salah brings peace to the heart and strengthens
                        your connection with Allah.
                    </p>

                </div>


                {/* Card 3 */}

                <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">

                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
                        <Info className="h-6 w-6 text-emerald-700" />
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-emerald-900">
                        Reminder
                    </h3>

                    <p className="text-sm leading-6 text-gray-600">
                        Prayer has been prescribed for believers at
                        appointed times.
                    </p>

                </div>

            </div>

        </section>
    );
}

export default PrayerRakaat;