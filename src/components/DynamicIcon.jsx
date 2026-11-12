import React from 'react'
import {
  Percent,
  ChartBar,
  Scales,
  BookBookmark,
  Calculator,
  Compass,
  Lightbulb,
  TrendUp,
  Brain,
  FileText,
} from '@phosphor-icons/react'

const iconMap = {
  Percent,
  ChartBar,
  Scales,
  BookBookmark,
  Calculator,
  Compass,
  Lightbulb,
  TrendUp,
  Brain,
  FileText,
}

export default function DynamicIcon({ name, size = 24, weight = 'bold', className = '' }) {
  const IconComponent = iconMap[name] || BookBookmark
  return <IconComponent size={size} weight={weight} className={className} />
}
