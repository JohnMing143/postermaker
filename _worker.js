addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  async function handleRequest(request) {
    const { searchParams } = new URL(request.url)
    const text = searchParams.get('text') || '默认文本'
    const fontSize = parseInt(searchParams.get('fontSize') || '30')
    const fontColor = searchParams.get('fontColor') || '#000000'
    const fontFamily = searchParams.get('fontFamily') || 'Arial'
    const textAlign = searchParams.get('textAlign') || 'middle'
    const lineHeight = parseFloat(searchParams.get('lineHeight') || '1.2')
    const bgType = searchParams.get('bgType') || 'color'
    const bgColor = searchParams.get('bgColor') || '#f0f0f0'
    const bgGradient = searchParams.get('bgGradient') || '#ffffff,#f0f0f0'
  
    const width = 500
    const height = 300
  
    const lines = text.split('\n')
    const svgText = lines.map((line, index) => {
      const y = height / 2 - (lines.length - 1) * fontSize * lineHeight / 2 + index * fontSize * lineHeight
      return `<text x="${textAlign === 'start' ? 10 : textAlign === 'end' ? width - 10 : width / 2}" y="${y}" 
        font-family="${fontFamily}, 'Microsoft YaHei', 'SimHei', sans-serif" 
        font-size="${fontSize}" fill="${fontColor}" text-anchor="${textAlign === 'start' ? 'start' : textAlign === 'end' ? 'end' : 'middle'}">${line}</text>`
    }).join('')
  
    let background;
    if (bgType === 'gradient') {
      const [color1, color2] = bgGradient.split(',')
      background = `<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
      </linearGradient>
      <rect width="100%" height="100%" fill="url(#grad1)"/>`
    } else {
      background = `<rect width="100%" height="100%" fill="${bgColor}"/>`
    }
  
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        ${background}
        ${svgText}
      </svg>
    `
  
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  }
  