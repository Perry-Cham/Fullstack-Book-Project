
export function fetchData() {
  return fetch('/data.json').then(response => response.json())
}

