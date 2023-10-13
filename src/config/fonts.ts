import { Open_Sans, Tenor_Sans } from 'next/font/google';

export const openSans = Open_Sans({
    subsets: ['latin'],
    variable: '--font-open-sans'
})

export const tenorSans = Tenor_Sans({
    subsets: ['latin'],
    weight: "400",
    variable: '--font-tenor-sans'
})