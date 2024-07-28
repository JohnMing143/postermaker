addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const { searchParams } = new URL(request.url)
  const text = searchParams.get('text') || '默认文本'
  const fontSize = parseInt(searchParams.get('fontSize') || '30')
  const fontColor = searchParams.get('fontColor') || '#000000'
  const fontFamily = searchParams.get('fontFamily') || 'siyuansong'
  const textAlign = searchParams.get('textAlign') || 'middle'
  const lineHeight = parseFloat(searchParams.get('lineHeight') || '1.2')
  const bgType = searchParams.get('bgType') || 'color'
  const bgColor = searchParams.get('bgColor') || '#f0f0f0'
  const bgGradient = searchParams.get('bgGradient') || '#ffffff,#a0a0a0,#f0f0f0'
  const width = parseInt(searchParams.get('width') || '500')
  const height = parseInt(searchParams.get('height') || '300')
  const lightEffect = searchParams.get('lightEffect') || 'none'
  const paperTexture = searchParams.get('paperTexture') || 'none'

  const lines = text.split('\n')
  const svgText = lines.map((line, index) => {
    const y = height / 2 - (lines.length - 1) * fontSize * lineHeight / 2 + index * fontSize * lineHeight
    return `<text x="${textAlign === 'start' ? 10 : textAlign === 'end' ? width - 10 : width / 2}" y="${y}" 
      font-family="${fontFamily}, sans-serif" 
      font-size="${fontSize}" fill="${fontColor}" text-anchor="${textAlign === 'start' ? 'start' : textAlign === 'end' ? 'end' : 'middle'}">${line}</text>`
  }).join('')


  let background;
  if (bgType === 'gradient') {
    const [color1, color2, color3] = bgGradient.split(',')
    background = `<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${color2};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color3};stop-opacity:1" />
    </linearGradient>
    <rect width="100%" height="100%" fill="url(#grad1)"/>`
  } else {
    background = `<rect width="100%" height="100%" fill="${bgColor}"/>`
  }

  let filters = ''
  let lightOverlay = ''

  // 改进纸张纹理
  if (paperTexture !== 'none') {
    filters += `
      <filter id="paper-texture">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise"/>
        <feDiffuseLighting in="noise" lighting-color="#fff" surfaceScale="2">
          <feDistantLight azimuth="45" elevation="60" />
        </feDiffuseLighting>
        <feComposite operator="in" in2="SourceGraphic"/>
        <feBlend mode="multiply" in2="SourceGraphic" result="textured"/>
    `
    if (paperTexture === 'rough') {
      filters += `
        <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="roughness"/>
        <feDisplacementMap in="textured" in2="roughness" scale="3" xChannelSelector="R" yChannelSelector="G"/>
      `
    } else if (paperTexture === 'canvas') {
      filters += `
        <feTurbulence type="turbulence" baseFrequency="0.1" numOctaves="2" result="canvas"/>
        <feDisplacementMap in="textured" in2="canvas" scale="2" xChannelSelector="R" yChannelSelector="G"/>
      `
    }
    filters += `</filter>`
  }

  // 改进光线效果
  if (lightEffect === 'window') {
    lightOverlay = `
      <defs>
        <linearGradient id="window-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="white" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </linearGradient>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#window-light)" filter="url(#blur)" opacity="0.4"/>
      <rect x="${width*0.1}" y="${height*0.1}" width="${width*0.2}" height="${height*0.2}" fill="white" filter="url(#blur)" opacity="0.6"/>
    `
  } else if (lightEffect === 'spotlight') {
    lightOverlay = `
      <defs>
        <radialGradient id="spotlight" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="white" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>
      </defs>
      <ellipse cx="${width/2}" cy="${height/2}" rx="${width/3}" ry="${height/3}" fill="url(#spotlight)" filter="url(#blur)" opacity="0.5"/>
    `
  }

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${filters}
      </defs>
      <g ${paperTexture !== 'none' ? 'filter="url(#paper-texture)"' : ''}>
        ${background}
        ${svgText}
      </g>
      ${lightOverlay}
    </svg>
  `

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}