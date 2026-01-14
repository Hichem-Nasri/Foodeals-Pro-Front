'use client'

import { useState } from 'react'
import Lottie from 'lottie-react'
import feedbackAnimation from '@/lotties/feedback.json'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useTranslations } from '@/hooks/useTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function FeedbackPage() {
  const { t } = useTranslations()
  const { toast } = useToast()
  const [feedback, setFeedback] =
    useState('')
  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    if (!feedback.trim()) {
      toast({
        title: t('feedbackPage.toast.pleaseEnterFeedback'),
        description: t('feedbackPage.toast.pleaseEnterFeedback'),
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Here you would typically send the feedback to your backend
      // For now, we'll just simulate a successful submission
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      )

      toast({
        title: t('feedbackPage.toast.feedbackSubmitted'),
      })
      setFeedback('')
    } catch (error) {
      toast({
        title: t('feedbackPage.toast.feedbackError'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRateApp = (
    platform: 'ios' | 'android'
  ) => {
    const urls = {
      ios: 'https://apps.apple.com/app/your-app-id',
      android:
        'https://play.google.com/store/apps/details?id=your.app.id',
    }

    window.open(
      urls[platform],
      '_blank'
    )
  }

  return (
    <div className='container mx-auto max-w-4xl px-4 py-10'>
      <div className='mb-8 flex items-center justify-between'>
        <Button
          variant='ghost'
          size='icon'
          asChild
          className='rounded-full'
        >
          <Link
            href='/'
            className='-lynch-500 flex items-center justify-center gap-2 rounded-full border lg:rounded-[14px]'
          >
            <ArrowLeft className='h-5 w-5' />
            <span className='sr-only'>
              {t('feedbackPage.back')}
            </span>
          </Link>
        </Button>
        <Link
          href='/'
          className='flex items-center justify-center'
        >
          <Image
            src='/images/logo-foodeals.svg'
            alt='Foodeals Logo'
            width={120}
            height={40}
            className='h-auto w-auto'
          />
        </Link>
        <div className='w-10'></div>{' '}
        {/* Spacer for balance */}
      </div>

      <h1 className='mb-8 text-center text-3xl font-bold'>
        {t('feedbackPage.title')}
      </h1>

      <div className='mb-10 flex flex-col items-center justify-center gap-8 md:flex-row lg:gap-12'>
        <div className='w-full md:w-1/2 lg:w-2/5'>
          <Lottie
            animationData={
              feedbackAnimation
            }
            loop={true}
            className='w-full'
          />
        </div>

        <Card className='w-full md:w-1/2 lg:w-3/5'>
          <CardHeader>
            <CardTitle>
              {t('feedbackPage.cardTitle')}
            </CardTitle>
            <CardDescription>
              {t('feedbackPage.cardDescription')}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent>
              <Textarea
                placeholder={t('feedbackPage.placeholder')}
                value={feedback}
                onChange={(e) =>
                  setFeedback(
                    e.target.value
                  )
                }
                className='min-h-[150px]'
              />
            </CardContent>

            <CardFooter>
              <Button
                type='submit'
                className='w-full'
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t('feedbackPage.submitting')
                  : t('feedbackPage.submitButton')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <div className='mt-12 text-center'>
        <h2 className='mb-6 text-2xl font-semibold'>
          {t('feedbackPage.rateTitle')}
        </h2>

        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Button
            onClick={() =>
              handleRateApp('ios')
            }
            className='flex gap-2 bg-slate-100 text-black hover:bg-slate-200'
          >
            <Image
              src='/icons/apple.png'
              alt='Apple'
              width={40}
              height={40}
              className='h-auto w-auto rounded-full object-contain'
            />
            {t('feedbackPage.rateAppStore')}
          </Button>

          <Button
            onClick={() =>
              handleRateApp('android')
            }
            className='flex gap-2 bg-slate-100 text-black hover:bg-slate-200'
          >
            <Image
              src='/icons/google.png'
              alt='Google Play'
              width={40}
              height={40}
              className='h-auto w-auto rounded-full object-contain'
            />
            {t('feedbackPage.ratePlayStore')}
          </Button>
        </div>
      </div>
    </div>
  )
}
