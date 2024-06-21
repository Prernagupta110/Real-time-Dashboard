export default async function () {
    const response = await fetch('/api/calendar')
    const responseJson = await response.json()
    return responseJson
}