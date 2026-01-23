"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Language } from "@/lib/landing-translations"
import { Card, CardContent, CardHeader } from "@/components/Card"
import { Button } from "@/components/Button"
import { Badge } from "@/components/Badge"
import { LanguageToggle } from "@/components/landing/LanguageToggle"
import {
  RiCheckLine,
  RiSparklingLine,
  RiUserLine,
  RiTeamLine,
  RiBuildingLine,
} from "@remixicon/react"

function PricingPageContent() {
  const searchParams = useSearchParams()
  const lang = (searchParams.get("lang") || "ar") as Language
  const dir = lang === "ar" ? "rtl" : "ltr"

  return (
    <div dir={dir} lang={lang}>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex aspect-square size-8 items-center justify-center rounded bg-primary-600 p-2 text-xs font-medium text-white dark:bg-primary-500">
                TD
              </span>
              <span className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                TabibDesk
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <div className="hidden items-center gap-3 sm:flex">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
                >
                  {lang === "ar" ? "تسجيل الدخول" : "Sign in"}
                </Link>
                <Link href="/register">
                  <Button variant="primary" className="text-sm">
                    {lang === "ar" ? "ابدأ مجاناً" : "Get Started"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="min-h-screen bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">
                {lang === "ar" ? "اختر خطتك" : "Choose Your Plan"}
              </h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                {lang === "ar"
                  ? "أسعار مرنة للممارسين الأفراد والعيادات النامية"
                  : "Flexible pricing for solo practitioners and growing clinics"}
              </p>
            </div>

            {/* Pricing Tiers */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Solo Plan */}
              <Card className="relative">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <RiUserLine className="size-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    {lang === "ar" ? "فردي" : "Solo"}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {lang === "ar" ? "للممارسين الأفراد" : "For solo practitioners"}
                  </p>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-gray-900 dark:text-gray-50">
                      $49
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {lang === "ar" ? "/شهر" : "/month"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <RiCheckLine className="mt-0.5 size-5 shrink-0 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {lang === "ar"
                          ? "مرضى ومواعيد غير محدودة"
                          : "Unlimited patients & appointments"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <RiCheckLine className="mt-0.5 size-5 shrink-0 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {lang === "ar"
                          ? "إدارة الأدوية والملفات"
                          : "Medications & files management"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <RiCheckLine className="mt-0.5 size-5 shrink-0 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {lang === "ar" ? "تنبيهات أساسية" : "Basic alerts"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <RiCheckLine className="mt-0.5 size-5 shrink-0 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {lang === "ar" ? "دعم عبر البريد الإلكتروني" : "Email support"}
                      </span>
                    </li>
                  </ul>
                  <Button variant="secondary" className="w-full">
                    {lang === "ar" ? "ابدأ الخطة الفردية" : "Start Solo Plan"}
                  </Button>
                </CardContent>
              </Card>

              {/* Multi Plan - Recommended */}
              <Card className="relative border-2 border-primary-600 dark:border-primary-500">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge
                    variant="default"
                    className="bg-primary-600 text-white dark:bg-primary-500"
                  >
                    {lang === "ar" ? "الأكثر شعبية" : "Most Popular"}
                  </Badge>
                </div>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/20">
                    <RiTeamLine className="size-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    {lang === "ar" ? "متعدد" : "Multi"}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {lang === "ar"
                      ? "للفرق الصغيرة والمواقع المتعددة"
                      : "For small teams & multi-location"}
                  </p>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-gray-900 dark:text-gray-50">
                      $99
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {lang === "ar" ? "/شهر" : "/month"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <RiCheckLine className="mt-0.5 size-5 shrink-0 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>
                          {lang === "ar" ? "كل ما في الفردي" : "Everything in Solo"}
                        </strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <RiCheckLine className="mt-0.5 size-5 shrink-0 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {lang === "ar"
                          ? "المهام والتعاون الجماعي"
                          : "Tasks & team collaboration"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <RiCheckLine className="mt-0.5 size-5 shrink-0 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {lang === "ar"
                          ? "رؤى وتحليلات متقدمة"
                          : "Advanced insights & analytics"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <RiCheckLine className="mt-0.5 size-5 shrink-0 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {lang === "ar" ? "تكامل المختبرات" : "Labs integration"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <RiCheckLine className="mt-0.5 size-5 shrink-0 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {lang === "ar"
                          ? "تذكيرات المواعيد"
                          : "Appointment reminders"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <RiCheckLine className="mt-0.5 size-5 shrink-0 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {lang === "ar" ? "دعم ذو أولوية" : "Priority support"}
                      </span>
                    </li>
                  </ul>
                  <Button variant="primary" className="w-full">
                    {lang === "ar" ? "ابدأ الخطة المتعددة" : "Start Multi Plan"}
                  </Button>
                </CardContent>
              </Card>

              {/* More Plan */}
              <Card className="relative">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                    <RiBuildingLine className="size-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    {lang === "ar" ? "أكثر" : "More"}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {lang === "ar" ? "للممارسات المتقدمة" : "For advanced practices"}
                  </p>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-gray-900 dark:text-gray-50">
                      $199
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {lang === "ar" ? "/شهر" : "/month"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <RiCheckLine className="mt-0.5 size-5 shrink-0 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>
                          {lang === "ar" ? "كل ما في المتعدد" : "Everything in Multi"}
                        </strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <RiSparklingLine className="mt-0.5 size-5 shrink-0 text-purple-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {lang === "ar"
                          ? "ملخص الملاحظات السريرية بالذكاء الاصطناعي"
                          : "AI Clinical Notes Summary"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <RiSparklingLine className="mt-0.5 size-5 shrink-0 text-purple-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {lang === "ar"
                          ? "الإملاء الصوتي بالذكاء الاصطناعي"
                          : "AI Voice Dictation"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <RiSparklingLine className="mt-0.5 size-5 shrink-0 text-purple-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {lang === "ar"
                          ? "استخراج تقارير المختبر بالذكاء الاصطناعي"
                          : "AI Lab Report Extraction"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <RiCheckLine className="mt-0.5 size-5 shrink-0 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {lang === "ar"
                          ? "تكاملات مخصصة"
                          : "Custom integrations"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <RiCheckLine className="mt-0.5 size-5 shrink-0 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {lang === "ar" ? "دعم مخصص" : "Dedicated support"}
                      </span>
                    </li>
                  </ul>
                  <Button variant="primary" className="w-full">
                    {lang === "ar" ? "ابدأ خطة المزيد" : "Start More Plan"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* AI Add-ons Section */}
            <div className="mt-16">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                  {lang === "ar" ? "إضافات الذكاء الاصطناعي" : "AI Add-ons"}
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {lang === "ar"
                    ? "عزز خطتك المتعددة بميزات الذكاء الاصطناعي الفردية"
                    : "Enhance your Multi plan with individual AI features"}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* AI Notes */}
                <Card className="text-center">
                  <CardContent className="py-6">
                    <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                      <RiSparklingLine className="size-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="mb-2 font-medium text-gray-900 dark:text-gray-50">
                      {lang === "ar" ? "الملاحظات السريرية بالذكاء الاصطناعي" : "AI Clinical Notes"}
                    </p>
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                      {lang === "ar"
                        ? "إنشاء ملخصات الزيارات تلقائياً"
                        : "Auto-generate visit summaries"}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                      $29/mo
                    </p>
                  </CardContent>
                </Card>

                {/* AI Dictation */}
                <Card className="text-center">
                  <CardContent className="py-6">
                    <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                      <RiSparklingLine className="size-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="mb-2 font-medium text-gray-900 dark:text-gray-50">
                      {lang === "ar" ? "الإملاء الصوتي" : "Voice Dictation"}
                    </p>
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                      {lang === "ar"
                        ? "النسخ من الصوت إلى النص"
                        : "Voice-to-text transcription"}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                      $29/mo
                    </p>
                  </CardContent>
                </Card>

                {/* AI Lab Extraction */}
                <Card className="text-center">
                  <CardContent className="py-6">
                    <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                      <RiSparklingLine className="size-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="mb-2 font-medium text-gray-900 dark:text-gray-50">
                      {lang === "ar" ? "استخراج المختبر بالذكاء الاصطناعي" : "Lab AI Extraction"}
                    </p>
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                      {lang === "ar"
                        ? "تحليل تقارير المختبر تلقائياً"
                        : "Parse lab reports automatically"}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                      $29/mo
                    </p>
                  </CardContent>
                </Card>

                {/* AI Bundle */}
                <Card className="border-2 border-purple-200 bg-purple-50 text-center dark:border-purple-800 dark:bg-purple-900/10">
                  <CardContent className="py-6">
                    <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg bg-purple-600 dark:bg-purple-500">
                      <RiSparklingLine className="size-5 text-white" />
                    </div>
                    <p className="mb-2 font-medium text-gray-900 dark:text-gray-50">
                      {lang === "ar" ? "حزمة الذكاء الاصطناعي" : "AI Bundle"}
                    </p>
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                      {lang === "ar"
                        ? "جميع ميزات الذكاء الاصطناعي متضمنة"
                        : "All AI features included"}
                    </p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      $69/mo
                    </p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      {lang === "ar" ? "وفر $18/شهر" : "Save $18/mo"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Feature Comparison Note */}
            <div className="mt-12 rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-900">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {lang === "ar"
                  ? "تتضمن جميع الخطط مرضى ومواعيد غير محدودة وتخزين بيانات آمن."
                  : "All plans include unlimited patients, appointments, and secure data storage."}
                <br />
                {lang === "ar"
                  ? "يمكنك الإلغاء في أي وقت. لا توجد عقود طويلة الأجل."
                  : "Cancel anytime. No long-term contracts."}
              </p>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                {lang === "ar"
                  ? "تحتاج مساعدة في اختيار خطة؟"
                  : "Need help choosing a plan?"}
              </p>
              <Button variant="secondary" onClick={() => (window.location.href = "/settings")}>
                {lang === "ar"
                  ? "قارن الميزات في الإعدادات"
                  : "Compare Features in Settings"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {lang === "ar"
              ? "© 2024 TabibDesk. جميع الحقوق محفوظة."
              : "© 2024 TabibDesk. All rights reserved."}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      }
    >
      <PricingPageContent />
    </Suspense>
  )
}
