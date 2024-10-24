export const physicalMental = {
    name: "Physical + Mental",
    sourceColumns: ["col-Physical", "col-Mental"],
    calculationFunction: (values) => values.reduce((a, b) => a + b, 0) / values.length,
    active: true,
}
