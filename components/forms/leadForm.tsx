'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Types
interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  eventType: string
  // Conditional fields
  fianceFirstName: string
  fianceLastName: string
  companyName: string
  schoolName: string
  // Details
  eventDate: string
  eventLocation: string
  bookingStage: string
  hearAboutUs: string
  eventDetails: string
  eventName: string
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  eventType: '',
  fianceFirstName: '',
  fianceLastName: '',
  companyName: '',
  schoolName: '',
  eventDate: '',
  eventLocation: '',
  bookingStage: '',
  hearAboutUs: '',
  eventDetails: '',
  eventName: '',
}

// Dropdown options
const eventTypes = [
  'Wedding DJ',
  'Pre Wedding Social DJ',
  'Graduation AV/Safe Grad',
  'School Dance',
  'Holiday Party',
  'Gala/Conference',
  'AV Rental',
  'Glam Photobooth',
  'Social Photobooth',
  '360 Photobooth',
]

const bookingStages = [
  'Early Stages. Just looking around for a DJ.',
  'We love your work and would like to meet you!',
  'Its YOU we need in our entertainment team!',
]

const hearAboutUsOptions = [
  'Google',
  'Facebook',
  'Instagram',
  'Tiktok',
  'Saw us perform at an event',
  'Through a Family/Friend',
  'Through another vendor',
  'Other',
]

// Event types that need specific conditional fields
const weddingTypes = ['Wedding DJ', 'Pre Wedding Social DJ']
const corporateTypes = ['Holiday Party', 'Gala/Conference', 'AV Rental']
const schoolTypes = ['Graduation AV/Safe Grad', 'School Dance']

export default function LeadForm() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Determine which conditional step to show based on event type
  const getConditionalStep = () => {
    if (weddingTypes.includes(formData.eventType)) return 'wedding'
    if (corporateTypes.includes(formData.eventType)) return 'corporate'
    if (schoolTypes.includes(formData.eventType)) return 'school'
    return 'none'
  }

  // Calculate total steps based on event type
  const getTotalSteps = () => {
    const conditionalStep = getConditionalStep()
    return conditionalStep === 'none' ? 7 : 8
  }

  // Map current step to actual step content
  const getStepContent = () => {
    const conditionalStep = getConditionalStep()
    
    // Steps: 0=welcome, 1=name, 2=email, 3=phone, 4=eventType, 5=conditional?, 6=date, 7=location, 8=bookingStage, 9=hearAbout, 10=details, 11=eventName, 12=success
    
    if (step === 0) return 'welcome'
    if (step === 1) return 'name'
    if (step === 2) return 'email'
    if (step === 3) return 'phone'
    if (step === 4) return 'eventType'
    
    if (conditionalStep !== 'none') {
      if (step === 5) return conditionalStep
      if (step === 6) return 'date'
      if (step === 7) return 'location'
      if (step === 8) return 'bookingStage'
      if (step === 9) return 'hearAbout'
      if (step === 10) return 'details'
      if (step === 11) return 'eventName'
      if (step === 12) return 'success'
    } else {
      if (step === 5) return 'date'
      if (step === 6) return 'location'
      if (step === 7) return 'bookingStage'
      if (step === 8) return 'hearAbout'
      if (step === 9) return 'details'
      if (step === 10) return 'eventName'
      if (step === 11) return 'success'
    }
    
    return 'welcome'
  }

  const getCurrentProgress = () => {
    const content = getStepContent()
    if (content === 'welcome') return { stage: 'start', index: 0 }
    if (['name', 'email', 'phone', 'eventType', 'wedding', 'corporate', 'school'].includes(content)) {
      return { stage: 'start', index: 1 }
    }
    if (['date', 'location', 'bookingStage', 'hearAbout', 'details'].includes(content)) {
      return { stage: 'details', index: 2 }
    }
    if (content === 'eventName') return { stage: 'last', index: 3 }
    if (content === 'success') return { stage: 'complete', index: 4 }
    return { stage: 'start', index: 0 }
  }

  const canGoNext = (): boolean => {
    const content = getStepContent()
    switch (content) {
      case 'welcome': return true
      case 'name': return !!(formData.firstName.trim() && formData.lastName.trim())
      case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      case 'phone': return formData.phone.trim().length >= 10
      case 'eventType': return formData.eventType !== ''
      case 'wedding': return !!(formData.fianceFirstName.trim() && formData.fianceLastName.trim())
      case 'corporate': return !!formData.companyName.trim()
      case 'school': return !!formData.schoolName.trim()
      case 'date': return formData.eventDate !== ''
      case 'location': return !!formData.eventLocation.trim()
      case 'bookingStage': return formData.bookingStage !== ''
      case 'hearAbout': return formData.hearAboutUs !== ''
      case 'details': return true // Optional
      case 'eventName': return !!formData.eventName.trim()
      default: return true
    }
  }

  const handleNext = () => {
    if (canGoNext()) {
      setStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/leads/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          service: 'Trident Music',
          source: 'WEBSITE_FORM',
        }),
      })

      if (!response.ok) throw new Error('Submission failed')

      setIsSubmitted(true)
      setStep(prev => prev + 1)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = getCurrentProgress()
  const stepContent = getStepContent()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress Bar */}
      {stepContent !== 'welcome' && (
        <div className="w-full px-8 py-6">
          <div className="max-w-md mx-auto flex items-center justify-center gap-3">
            {['Start', 'Details', 'Last step'].map((label, index) => {
              const isComplete = progress.index > index + 1
              const isCurrent = (progress.stage === 'start' && index === 0) ||
                               (progress.stage === 'details' && index === 1) ||
                               (progress.stage === 'last' && index === 2) ||
                               (progress.stage === 'complete' && index <= 2)
              const isPast = progress.index > index + 1 || progress.stage === 'complete'
              
              return (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      isPast || (progress.stage === 'complete') 
                        ? 'bg-gray-800 border-gray-800' 
                        : isCurrent 
                          ? 'border-gray-800 bg-white' 
                          : 'border-gray-300 bg-white'
                    }`}>
                      {(isPast || progress.stage === 'complete') ? (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isCurrent ? (
                        <div className="w-2 h-2 rounded-full bg-gray-800" />
                      ) : null}
                    </div>
                    <span className={`text-sm font-medium ${
                      isCurrent || isPast || progress.stage === 'complete' ? 'text-gray-800' : 'text-gray-400'
                    }`}>
                      {label}
                    </span>
                  </div>
                  {index < 2 && (
                    <div className={`w-16 h-0.5 ${
                      isPast || (progress.stage === 'complete') ? 'bg-gray-800' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepContent}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Welcome Screen */}
              {stepContent === 'welcome' && (
                <div className="text-center">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Truly, we can't wait to get the party started! 🎉
                  </h1>
                  <p className="text-gray-500 mb-8">
                    Please fill out this form and we'll reach out to you shortly!
                  </p>
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-gray-900 text-white font-medium rounded hover:bg-gray-800 transition-colors"
                  >
                    Start
                  </button>
                </div>
              )}

              {/* Name */}
              {stepContent === 'name' && (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        placeholder="Please type in your first name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all text-gray-900 bg-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        placeholder="Please type in your last name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all text-gray-900 bg-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  <NavigationButtons onBack={handleBack} onNext={handleNext} canGoNext={canGoNext()} showBack={step > 0} />
                </div>
              )}

              {/* Email */}
              {stepContent === 'email' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Hi {formData.firstName}! 👋
                  </h2>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mb-6">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="Please type in your email"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all text-gray-900 bg-white placeholder:text-gray-400"
                    />
                  </div>
                  <NavigationButtons onBack={handleBack} onNext={handleNext} canGoNext={canGoNext()} />
                </div>
              )}

              {/* Phone */}
              {stepContent === 'phone' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mb-6">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="What's the best phone number we could reach you at?"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all text-gray-900 bg-white placeholder:text-gray-400"
                    />
                  </div>
                  <NavigationButtons onBack={handleBack} onNext={handleNext} canGoNext={canGoNext()} />
                </div>
              )}

              {/* Event Type */}
              {stepContent === 'eventType' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What type of event do you need us for? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => updateField('eventType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all appearance-none bg-white mb-6 text-gray-900"
                  >
                    <option value="">Choose the type of event!</option>
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <NavigationButtons onBack={handleBack} onNext={handleNext} canGoNext={canGoNext()} />
                </div>
              )}

              {/* Wedding - Fiancé Names */}
              {stepContent === 'wedding' && (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fiancé's First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fianceFirstName}
                        onChange={(e) => updateField('fianceFirstName', e.target.value)}
                        placeholder="Please type in your fiancé's first name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all text-gray-900 bg-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fiancé's Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fianceLastName}
                        onChange={(e) => updateField('fianceLastName', e.target.value)}
                        placeholder="Please type in your fiancé's last name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all text-gray-900 bg-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  <NavigationButtons onBack={handleBack} onNext={handleNext} canGoNext={canGoNext()} />
                </div>
              )}

              {/* Corporate - Company Name */}
              {stepContent === 'corporate' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company/Organization Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    placeholder="Please enter the name of your company/organization."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all mb-6 text-gray-900 bg-white placeholder:text-gray-400"
                  />
                  <NavigationButtons onBack={handleBack} onNext={handleNext} canGoNext={canGoNext()} />
                </div>
              )}

              {/* School - School Name */}
              {stepContent === 'school' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => updateField('schoolName', e.target.value)}
                    placeholder="Please enter the name of your school"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all mb-6 text-gray-900 bg-white placeholder:text-gray-400"
                  />
                  <NavigationButtons onBack={handleBack} onNext={handleNext} canGoNext={canGoNext()} />
                </div>
              )}

              {/* Event Date */}
              {stepContent === 'date' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    When is the event happening? <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    If you don't have a date yet, choose the closest option.
                  </p>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => updateField('eventDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all mb-6 text-gray-900 bg-white"
                  />
                  <NavigationButtons onBack={handleBack} onNext={handleNext} canGoNext={canGoNext()} />
                </div>
              )}

              {/* Event Location */}
              {stepContent === 'location' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Where is the event happening? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.eventLocation}
                    onChange={(e) => updateField('eventLocation', e.target.value)}
                    placeholder="Please type in the location of your event."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all mb-6 text-gray-900 bg-white placeholder:text-gray-400"
                  />
                  <NavigationButtons onBack={handleBack} onNext={handleNext} canGoNext={canGoNext()} />
                </div>
              )}

              {/* Booking Stage */}
              {stepContent === 'bookingStage' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Where are you currently in the booking process? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.bookingStage}
                    onChange={(e) => updateField('bookingStage', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all appearance-none bg-white mb-6 text-gray-900"
                  >
                    <option value="">Give us an idea of where you are in your planning journey!</option>
                    {bookingStages.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                  <NavigationButtons onBack={handleBack} onNext={handleNext} canGoNext={canGoNext()} />
                </div>
              )}

              {/* How did you hear about us */}
              {stepContent === 'hearAbout' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How did you hear about us? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.hearAboutUs}
                    onChange={(e) => updateField('hearAboutUs', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all appearance-none bg-white mb-6 text-gray-900"
                  >
                    <option value="">We'd love to know how you heard about us!</option>
                    {hearAboutUsOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <NavigationButtons onBack={handleBack} onNext={handleNext} canGoNext={canGoNext()} />
                </div>
              )}

              {/* Event Details */}
              {stepContent === 'details' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Good work {formData.firstName}! One last question -
                  </h2>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us about your event!
                  </label>
                  <textarea
                    value={formData.eventDetails}
                    onChange={(e) => updateField('eventDetails', e.target.value)}
                    placeholder="We'd love to know absolutely everything about this party and what you've got planned!"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all resize-none mb-6 text-gray-900 bg-white placeholder:text-gray-400"
                  />
                  <NavigationButtons onBack={handleBack} onNext={handleNext} canGoNext={canGoNext()} />
                </div>
              )}

              {/* Event Name (Final Step) */}
              {stepContent === 'eventName' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    You are one step closer to the BEST PARTY EVER!
                  </h2>
                  <p className="text-gray-600 mb-2">
                    Thank you so much for taking the time to fill out this form!
                  </p>
                  <p className="text-gray-600 mb-4">
                    We understand how much entertainment is important to an event and we are excited to be part of yours!
                  </p>
                  <p className="text-gray-600 mb-6">
                    Hit the submit button below and we'll be in touch with you very shortly!
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Name <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.eventName}
                      onChange={(e) => updateField('eventName', e.target.value)}
                      placeholder="Give your event a name (e.g., Smith Wedding, Annual Gala 2025)"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all resize-none bg-white text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleBack}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!canGoNext() || isSubmitting}
                      className="px-8 py-3 bg-gray-900 text-white font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </div>
              )}

              {/* Success Screen */}
              {stepContent === 'success' && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Thank you {formData.firstName}!
                  </h2>
                  <p className="text-gray-500">
                    We are beyond thrilled you reached out to us!
                  </p>
                  <p className="text-gray-500">
                    Can't wait to chat more!
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// Navigation Buttons Component
function NavigationButtons({ 
  onBack, 
  onNext, 
  canGoNext, 
  showBack = true 
}: { 
  onBack: () => void
  onNext: () => void
  canGoNext: boolean
  showBack?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      {showBack && (
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      )}
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className="px-6 py-3 bg-gray-900 text-white font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        Next
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}