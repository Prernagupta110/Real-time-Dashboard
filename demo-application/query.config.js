export default async function(fileName) {
    const { default: defaultFn } = await import(/* @vite-ignore */ `./src/actions/${fileName}.js`)
    return defaultFn
}