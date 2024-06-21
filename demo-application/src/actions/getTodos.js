export default async function () {
    const response = await fetch('/api/todos')
    const responseJson = await response.json()
    return responseJson
}