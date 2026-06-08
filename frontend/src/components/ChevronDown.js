import React from 'react';
import { Feather } from '@expo/vector-icons';

export function ChevronDown({ size = 22, color, style }) {
  return <Feather name="chevron-down" size={size} color={color} style={style} />;
}
