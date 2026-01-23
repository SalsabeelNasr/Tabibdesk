import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Icon styles - Note: ImageResponse API only supports inline styles, not CSS classes
// See globals.css for style documentation
const iconStyles = {
  fontSize: 18,
  background: '#158ce2',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: 6,
} as const
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div style={iconStyles}>
        TD
      </div>
    ),
    {
      ...size,
    }
  )
}

