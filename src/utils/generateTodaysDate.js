export function generateTodaysDate(pt_br=true) {
    return pt_br ? new Date().toLocaleDateString('pt-br') : new Date().toLocaleDateString('en-US')
}