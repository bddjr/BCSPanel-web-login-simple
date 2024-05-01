import fs from 'fs'


function rfs(path) {
    return fs.readFileSync(path).toString()
}

const css = rfs('src.css')
    .replaceAll(/\r?\n( +|\t)?/g, '')
    .replaceAll(/;}/g, '}')
    .replaceAll(/\s+{/g, '{')
    .replaceAll(/:\s+/g, ':')


function buildJS(input) {
    return input
        .replaceAll(/(^|\r?\n)\/\/.+\r?\n/g, '')
        .replaceAll(/\r\n\s+/g, '\r\n')
        .replaceAll(/\s+([=?:{}()]|=>)/g, '$1')
        .replaceAll(/([=?:{}()]|=>)\s+/g, '$1')
        .replaceAll(/[\r\n\t]/g, '')
        .replaceAll(/;($|})/g, '$1')
}

const evalJs = buildJS(rfs('src.eval.js'))
const js = buildJS(rfs('src.try.js'))
    .replace('"{{src.eval.js}}"', JSON.stringify(evalJs))


const html = rfs('src.html')
    .replaceAll(/="([\w\.\-]+)" ?/g, '=$1 ')
    .replaceAll(/(?<=style="\S+:) (?=\S+" ?)/g, '')
    .replaceAll(/(style=".+);"/g, '$1"')
    .replaceAll(/\s+\/?>/g, '>')
    .replaceAll(/" (\w)/g, '"$1')
    .replace('name=robots', 'name="robots"')
    .replaceAll(/[\t\n\r]/g, '')
    .replace(`<!--{{src.css}}-->`, `<style>${css}</style>`)
    .replace(`<!--{{src.try.js}}-->`, `<script>${js}</script>`)


fs.writeFileSync('login-simple.html', html)
