"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ShieldCheck, CreditCard, XCircle, AlertTriangle, Home, Activity, UserX, Wine, Package, FileText, MinusCircle } from "lucide-react"

export default function TermsPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const sections = [
        {
            icon: <CreditCard className="h-6 w-6 text-primary" />,
            title: "Booking & Payments",
            points: [
                "Advance payment is required to confirm your booking.",
                "Full payment of the trip or stay must be completed before departure."
            ]
        },
        {
            icon: <XCircle className="h-6 w-6 text-primary" />,
            title: "Cancellation Policy",
            points: [
                "The advance payment is non-refundable.",
                "No refunds will be provided for last-minute cancellations or no-shows."
            ]
        },
        {
            icon: <AlertTriangle className="h-6 w-6 text-primary" />,
            title: "Itinerary & Safety",
            points: [
                "The itinerary is subject to change due to weather, road conditions, or safety concerns.",
                "Trip leaders reserve the right to modify plans at any time if required for the safety of the group."
            ]
        },
        {
            icon: <Home className="h-6 w-6 text-primary" />,
            title: "Accommodations",
            points: [
                "Stays will be in hotels, homestays, or camps as specified.",
                "Room sharing will be based on the selected occupancy level during booking."
            ]
        },
        {
            icon: <Activity className="h-6 w-6 text-primary" />,
            title: "Fitness & Medical",
            points: [
                "Wanderpals trips often involve high altitudes. A basic level of fitness is required.",
                "Travelers must inform trip leaders about any pre-existing medical conditions before the journey begins."
            ]
        },
        {
            icon: <UserX className="h-6 w-6 text-primary" />,
            title: "Conduct & Behavior",
            points: [
                "Misconduct or unsafe behavior is strictly prohibited.",
                "Anyone causing disturbance to the group or locals may be removed from the trip without any refund."
            ]
        },
        {
            icon: <Wine className="h-6 w-6 text-primary" />,
            title: "Alcohol & Smoking",
            points: [
                "Alcohol and smoking are not allowed inside vehicles.",
                "Travelers are expected to refrain from use during travel hours for safety and group harmony."
            ]
        },
        {
            icon: <Package className="h-6 w-6 text-primary" />,
            title: "Liability & Belongings",
            points: [
                "Travelers are solely responsible for their luggage and valuables.",
                "Wanderpals holds no liability for lost, stolen, or damaged items during the trip."
            ]
        },
        {
            icon: <FileText className="h-6 w-6 text-primary" />,
            title: "Documentation",
            points: [
                "A valid government-issued ID is mandatory for all travelers.",
                "Travel may be denied without valid ID proof, and no refunds will be issued in such cases."
            ]
        },
        {
            icon: <MinusCircle className="h-6 w-6 text-primary" />,
            title: "Exclusions",
            points: [
                "Personal expenses (shopping, laundry, etc.).",
                "Entrance fees to monuments, parks, or attractions unless specified.",
                "Additional meals outside the provided itinerary.",
                "Heater charges at homestays or hotels.",
                "Emergency expenses arising from route changes or medical needs."
            ]
        },
        {
            icon: <ShieldCheck className="h-6 w-6 text-primary" />,
            title: "Force Majeure",
            points: [
                "Wanderpals bears no liability for delays or cancellations due to landslides, road blocks, or natural disasters.",
                "No refunds or compensation for disruptions caused by political disturbances or weather conditions."
            ]
        }
    ]

    return (
        <main className="grain min-h-screen bg-background text-foreground">
            <div className="mx-auto max-w-4xl px-6 py-24 md:px-16 lg:px-24">
                {/* Header */}
                <div className="mb-16 space-y-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 group">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span className="font-sans text-sm">Return Home</span>
                    </Link>
                    <h1 className={`font-serif text-5xl md:text-7xl font-medium tracking-tight transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        Terms & <span className="text-primary italic">Conditions</span>
                    </h1>
                    <p className="font-sans text-muted-foreground max-w-xl">
                        The formal agreement of our journey together. Please read these terms carefully before joining the tribe.
                    </p>
                </div>

                {/* Sections Grid */}
                <div className="grid gap-8">
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            className={`group p-8 rounded-2xl border border-muted-foreground/10 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/20 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                                    {section.icon}
                                </div>
                                <h2 className="font-serif text-2xl font-medium pt-2">{section.title}</h2>
                            </div>
                            <ul className="space-y-3 pl-14">
                                {section.points.map((point, pIndex) => (
                                    <li key={pIndex} className="font-sans text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                                        <span className="block h-1.5 w-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-20 pt-8 border-t border-muted-foreground/10 text-center space-y-4">
                    <p className="font-sans text-xs text-muted-foreground/40 uppercase tracking-widest">
                        Last Updated: February 2026
                    </p>
                    <Link
                        href="/all-trips"
                        className="inline-block py-3 px-8 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-full font-sans text-sm font-semibold transition-all"
                    >
                        I understand, take me to trips
                    </Link>
                </div>
            </div>
        </main>
    )
}
