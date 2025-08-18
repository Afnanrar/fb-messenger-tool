export function processSpintax(text: string): string {
  const regex = /{([^{}]+)}/g
  
  return text.replace(regex, (match, group) => {
    const options = group.split('|')
    return options[Math.floor(Math.random() * options.length)]
  })
}

// Example: "Hello {friend|buddy|pal}!" -> "Hello buddy!"
