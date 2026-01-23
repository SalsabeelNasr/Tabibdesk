import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Apple icon styles - Note: ImageResponse API only supports inline styles, not CSS classes
// See globals.css for style documentation
const appleIconStyles = {
  fontSize: 72,
  background: '#158ce2',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: 32,
} as const
 
// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={appleIconStyles}>
        TD
      </div>
    ),
    {
      ...size,
    }
  )
}

