function L(value, lbl) {
    return {label: lbl, value: value}
}

function h(_half, _effect) {
    return {half: _half, effect: _effect}
}

const standard = [L('standard', 'Standard')]
const oral = L('oral', 'Oral')
const injectable = L('injectable', 'Injectable')
const suspension = L('suspesion', 'Suspension')
const enanthate = L('enanthate', 'Enanthate')
const propionate = L('propionate', 'Propionate')

export const compoundList = {
    testosterone: [
        suspension,
        propionate,
        L('phenylpropionate', 'PhenylPropionate'),
        L('isocaproate', 'Isocaproate'),
        enanthate,
        L('cypionate', 'Cypionate'),
        L('decanoate', 'Decanoate'),
        L('undecanoate', 'Undecanoate')
    ],
    trenbolone: [
        suspension,
        L('acetate', 'Acetate'),
        enanthate,
    ],
    masteron: [propionate, enanthate],
    nandrolone: [
        L('phenylpropionate', 'Phenylpropionate (NPP)'),
        L('decanoate', 'Decanoate (Deca Durabolin)')
    ],
    equipoise: standard,
    primobolan: [oral, injectable],
    halotestin: standard,
    anadrol: standard,
    dianabol: standard,
    turinabol: standard,
    winstrol: [oral, injectable],
    analet: standard,
    superdrol: standard,
    dnp: [
        L('crystal', 'Crystal'),
        L('powder', 'Powder')
    ],
    aromasin: standard,
    arimidex: standard,
    '-': standard,
}

const halfLife = {
    testosterone: {
        suspesion: h(0.5, 1),
        propionate: h(0.8, 0.8),
        phenylpropionate: h(1.5, 0.66),
        isocaproate: h(4.0, 0.72),
        enanthate: h(4.5, 0.7),
        cypionate: h(5.0, 0.69),
        decanoate: h(7.5, 0.62),
        undecanoate: h(20.9, 0.61)
    },
    trenbolone: {
        suspesion: h(0.5, 1),
        enanthate: h(4.5, 0.7),
        acetate: h(1, 0.87)
    },
    masteron: {
        propionate: h(0.8, 0.8),
        enanthate: h(4.5, 0.7)
    },
    nandrolone: {
        phenylpropionate: h(1.5, 0.67),
        decanoate: h(7.5, 0.64)
    },
    equipoise: h(14, 0.61),
    primobolan: {
        oral: h(0.2083, 1),
        injectable: h(4.5, 0.7)
    },
    halotestin: h(0.2916, 1),
    anadrol: h(0.5833, 1),
    dianabol: h(0.2083, 1),
    turinabol: h(0.6666, 1),
    winstrol: {
        oral: h(0.3333, 1),
        injectable: h(1, 0.87)
    },
    analet: h(0.4166, 1),
    superdrol: h(0.4166, 1),
    dnp: {
        crystal: h(1.5, 0.75),
        powder: h(1.5, 1)
    },
    aromasin: h(1, 1),
    arimidex: h(1.95, 1)
}

export function plotGraph(compounds, cycleLength) {
    let x_axis = [];
    let time = 2
    const days = cycleLength * 7;
    const series = []
    const weeklyDoses = []
    let totalWeeklyDose = 0

    compounds.forEach(c => {
        if (c.compoundProps.schedule === '0.5')
            time = 4
    })

    for (let i = 0; i < days; i++) {
        if (time === 4) {
            x_axis.push(i);
            x_axis.push(i + 0.25);
            x_axis.push(i + 0.5);
            x_axis.push(i + 0.75);
        } else {
            x_axis.push(i);
            x_axis.push(i + 0.5);
        }
    }

    compounds.forEach(c => {
        const {dose, compound, compoundForm, schedule, from, to} = c.compoundProps
        let start = parseInt(from) * 7 - 7;
        let dayDifference = (parseInt(to) * 7) - start;
        let half = 1;
        let effect = 1;
        let compoundLabel = '-'
        const cycleData = new Array(x_axis.length).fill(0);
        let weeklyDose = (parseFloat(dayDifference) / parseFloat(schedule)) * parseFloat(dose) / (dayDifference / 7)

        const setCompoundLabel = (data) => {
            for (let x = 0; x < data.length; x++) {
                const form = data[x]
                if (form.value === compoundForm) {
                    compoundLabel = compound + ' ' + form.label.toLowerCase()
                    break;
                }
            }
        }

        switch (compound) {
            default:
                try {
                    ({half, effect} = halfLife[compound])
                } catch {
                }
                compoundLabel = compound
                break
            case 'testosterone':
                ({half, effect} = halfLife[compound][compoundForm])
                setCompoundLabel(compoundList[compound])
                break
            case 'trenbolone':
                ({half, effect} = halfLife[compound][compoundForm])
                setCompoundLabel(compoundList[compound])
                break
            case 'masteron':
                ({half, effect} = halfLife[compound][compoundForm])
                setCompoundLabel(compoundList[compound])
                break
            case 'nandrolone':
                ({half, effect} = halfLife[compound][compoundForm])
                setCompoundLabel(compoundList[compound])
                break
            case 'primobolan':
                ({half, effect} = halfLife[compound][compoundForm])
                setCompoundLabel(compoundList[compound])
                break
            case 'winstrol':
                ({half, effect} = halfLife[compound][compoundForm])
                setCompoundLabel(compoundList[compound])
                break
            case 'dnp':
                ({half, effect} = halfLife[compound][compoundForm])
                setCompoundLabel(compoundList[compound])
                break
        }


        const scheduleByNumber = () => {
            for (let i = 0; i < (x_axis.length - (start * time)); i++) {
                let dailyDose = Math.exp(-x_axis[i] * Math.log(2) / half) * dose * effect * Math.log(2) / half;
                dailyDose = +dailyDose.toFixed(2);
                for (let y = 0; y < (dayDifference * time); y += (parseFloat(schedule) * time)) {
                    if ((i + y + (start * time)) >= x_axis.length) {
                        break;
                    }
                    let temp;
                    if (isNaN(cycleData[i + y + (start * time)])) {
                        temp = 0;
                    } else {
                        temp = cycleData[i + y + (start * time)];
                    }
                    let totalDailyDose = dailyDose + temp;
                    if (isNaN(totalDailyDose)) {

                    } else {
                        totalDailyDose = +totalDailyDose.toFixed(2);
                        cycleData[i + y + (start * time)] = totalDailyDose;
                    }
                }
                ;
            }
        }

        const scheduleByDay = (y_constant) => {
            for (let i = 0; i < (x_axis.length - (start * time)); i++) {
                let dailyDose = Math.exp(-x_axis[i] * Math.log(2) / half) * dose * effect * Math.log(2) / half;
                dailyDose = +dailyDose.toFixed(2);
                for (let y = y_constant * time; y < (dayDifference * time); y += (7 * time)) {
                    if ((i + y + (start * time)) >= x_axis.length) {
                        break;
                    }
                    let totalDailyDose = dailyDose + cycleData[i + y + (start * time)];
                    totalDailyDose = +totalDailyDose.toFixed(2);
                    cycleData[i + y + (start * time)] = totalDailyDose;
                }
                ;
            }
        }
        const modifiedWeeklyDose = (modifier) => {
            const numDays = dayDifference - modifier
            const week = numDays / 7
            return (dose * week) / 7
        }

        //( Exp(-(dia  ) * LN( 2 ) / half )* dose * weigh * LN( 2 )/ E$4,2)
        switch (schedule) {
            default:
                scheduleByNumber()
                weeklyDose = (parseFloat(dayDifference) / parseFloat(schedule)) * parseFloat(dose) / (dayDifference / 7)
                break;
            case "mon":
                scheduleByDay(0)
                weeklyDose = modifiedWeeklyDose(0)
                break;
            case "tue":
                scheduleByDay(1)
                weeklyDose = modifiedWeeklyDose(1)
                break;
            case "wed":
                scheduleByDay(2)
                weeklyDose = modifiedWeeklyDose(2)
                break;
            case "thu":
                scheduleByDay(3)
                weeklyDose = modifiedWeeklyDose(3)
                break;
            case "fri":
                scheduleByDay(4)
                weeklyDose = modifiedWeeklyDose(4)
                break;
            case "sat":
                scheduleByDay(5)
                weeklyDose = modifiedWeeklyDose(5)
                break;
            case "sun":
                scheduleByDay(6)
                weeklyDose = modifiedWeeklyDose(6)
                break;
        }

        weeklyDoses.push({compound: compoundLabel, dose: weeklyDose})
        totalWeeklyDose += weeklyDose
        series.push({
            name: compoundLabel,
            data: cycleData
        });
    })
    return {series: series, x_axis: x_axis, weeklyDoses: weeklyDoses, totalWeeklyDose: totalWeeklyDose}
}
