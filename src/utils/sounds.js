export const playSound = (src, volume = 1) => {
    const audio = new Audio(src)
    audio.volume = volume
    audio.play()
  }