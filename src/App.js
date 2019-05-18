import React from 'react';
import {compoundList, plotGraph} from './plotGraph'
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts'


const weekLength = 30

function createChartOptions(x_axis = [], series = []) {
    return {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Release mg/day'
        },
        xAxis: {
            categories: x_axis
        },
        yAxis: {
            title: {
                text: 'Miligrams'
            }
        },
        series: series
    }
}

class SingleCompound extends React.Component {
    state = {
        compound: '-',
        compoundForm: undefined,
        dose: undefined,
        schedule: undefined,
        from: undefined,
        to: undefined,
    }

    static defaultProps = {
        onClose: () => {
        }
    }

    componentDidMount() {
        this.setState(this.props.compoundProps)
    }

    render() {
        const {week, compounds, drugCompound, index} = this.props
        const stateCb = () => compounds[index].compoundProps = this.state
        return (
            <div className='row'>

                <div className='col-sm-2 border'>
                    <div className="input-group-append">
                        <input type="text" className="form-control"
                               onChange={e => this.setState({dose: e.target.value}, stateCb)}/>
                        <div className='input-group-text'>mg</div>
                    </div>
                </div>

                <div className='col-sm-3 border'>
                    <select className="form-control" defaultValue={drugCompound}
                            onChange={e => {
                                const {from, to, schedule} = this.state
                                this.setState({
                                    compound: e.target.value,
                                    compoundForm: compoundList[e.target.value][0].value,
                                    from: from === undefined ? 1 : from,
                                    to: to === undefined ? 1 : to,
                                    schedule: schedule === undefined ? 0.5 : schedule
                                }, stateCb)
                            }}>
                        <option value="-" style={{display: 'none'}}>Compound</option>
                        <option value="testosterone">Testosterone</option>
                        <option value="trenbolone">Trenbolone</option>
                        <option value="masteron">Masteron</option>
                        <option value="nandrolone">Nandrolone (Deca/NPP)</option>
                        <option value="equipoise">Equipoise</option>
                        <option value="primobolan">Primobolan</option>
                        <option value="halotestin">Halotestin</option>
                        <option value="anadrol">Anadrol</option>
                        <option value="dianabol">Dianabol</option>
                        <option value="turinabol">Turinabol</option>
                        <option value="winstrol">Winstrol</option>
                        <option value="analet">Analet</option>
                        <option value="superdrol">Superdrol</option>
                        <option value="dnp">DNP</option>
                        <option value="arimidex">Arimidex</option>
                    </select>
                    {compoundList[this.state.compound][0].value !== 'standard' ?
                        <select className="form-control"
                                defaultValue={compoundList[this.state.compound][0].value}
                                onChange={e => this.setState({
                                    compoundForm: e.target.value
                                }, stateCb)}
                        >
                            {compoundList[this.state.compound].map((c, index) => {
                                return <option key={index} value={c.value}>{c.label}</option>
                            })}
                        </select> : null
                    }
                </div>

                <div className='col-sm-3 border'>
                    <select className="form-control"
                            onChange={e => this.setState({schedule: e.target.value}, stateCb)}
                    >
                        <option value="0.5">Twice a day</option>
                        <option value="1">Every day</option>
                        <option value="2">Every other day</option>
                        <option value="3">Every 3 days</option>
                        <option value="3.5">Every 3.5 days</option>
                        <option value="4">Every 4 days</option>
                        <option value="5">Every 5 days</option>
                        <option value="6">Every 6 days</option>
                        <option value="7">Every 7 days</option>
                        <option value="10">Every 10 days</option>
                        <option value="14">Every 14 days</option>
                        <option value="21">Every 21 days</option>
                        <option value="28">Every 4 weeks</option>
                        <option value="35">Every 5 weeks</option>
                        <option value="42">Every 6 weeks</option>
                        <option value="49">Every 7 weeks</option>
                        <option value="56">Every 8 weeks</option>
                        <option value="mon">Every Monday</option>
                        <option value="tue">Every Tuesday</option>
                        <option value="wed">Every Wednesday</option>
                        <option value="thu">Every Thursday</option>
                        <option value="fri">Every Friday</option>
                        <option value="sat">Every Saturday</option>
                        <option value="sun">Every Sunday</option>
                    </select>
                </div>

                <div className='col-sm-3 border'>
                    <div className="input-group-prepend">
                        <div className="input-group-text col-sm-3">From</div>
                        <select className="form-control col-sm-9" defaultValue={1}
                                onChange={e => this.setState({from: e.target.value}, stateCb)}
                        >
                            {Array.from({length: week}, (e, index) =>
                                <option key={index} value={`${index + 1}`}>{'week ' + (index + 1)}</option>)}
                        </select>
                    </div>
                    <div className="input-group-prepend">
                        <div className="input-group-text col-sm-3">To</div>
                        <select className="form-control col-sm-9" defaultValue={1}
                                onChange={e => this.setState({to: e.target.value}, stateCb)}
                        >
                            {Array.from({length: week}, (e, index) =>
                                <option key={index} value={`${index + 1}`}>{'week ' + (index + 1)}</option>)}
                        </select>
                    </div>
                </div>

                <div className='col-sm-1 border'>
                    <button className='btn btn-md btn-danger'
                            onClick={this.props.onClose}
                    >Del
                    </button>
                </div>

            </div>
        );
    }
}


class App extends React.Component {
    state = {
        week: 1,
        compoundLength: 1,
        compounds: [{
            compoundProps: {
                compound: '-',
                compoundForm: undefined,
                dose: undefined,
                schedule: undefined,
                from: undefined,
                to: undefined,
            }
        }],
        totalWeeklyDose: 0,
        weeklyDoses: [],
        chartOptions: createChartOptions()
    }

    render() {
        return (
            <div className="container container-fluid">
                <h2>Plot your cycle</h2>
                <form onSubmit={e => e.preventDefault()}>
                    <div className='form-group form-inline'>
                        <label>How many weeks would you like to graph?</label>
                        <select className='form-control'
                                style={{marginLeft: '5px'}}
                                onChange={e =>
                                    this.setState({week: parseInt(e.target.value)})}>
                            {Array.from({length: weekLength}, (e, index) =>
                                <option key={index}
                                        value={`${index + 1}`}>{(index + 1) + ' week(s)'}</option>)}
                        </select>
                    </div>

                    <div className='card'>
                        <div className='card-header'>What compound(s) are you taking?</div>

                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-sm-2 d-flex justify-content-center border'>Dose</div>
                                <div className='col-sm-3 d-flex justify-content-center border'>Compound</div>
                                <div className='col-sm-3 d-flex justify-content-center border'>Scheme</div>
                                <div className='col-sm-3 d-flex justify-content-center border'>Duration</div>
                                <div className='col-sm-1 d-flex justify-content-center border'>Action</div>
                            </div>
                            {this.state.compounds.map((e, index) => {
                                return <SingleCompound week={this.state.week}
                                                       drugCompound={e.compoundProps.compound} key={e + index}
                                                       onClose={() => {
                                                           this.state.compounds.splice(index, 1)
                                                           this.setState({compounds: this.state.compounds})
                                                       }}
                                                       compounds={this.state.compounds} index={index}/>

                            })}
                        </div>
                    </div>


                    <div className="row" style={{marginTop: '20px', marginBottom: '20px'}}>
                        <div className="col-sm-12  d-flex justify-content-center">
                            <button className="btn btn-dark"
                                    onClick={() => {
                                        const {series, x_axis, totalWeeklyDose, weeklyDoses} = plotGraph(this.state.compounds, this.state.week)
                                        this.setState({
                                            chartOptions: createChartOptions(x_axis, series),
                                            totalWeeklyDose: totalWeeklyDose,
                                            weeklyDoses: weeklyDoses
                                        })
                                    }}
                                    style={{marginRight: '20px'}}
                            >Plot
                            </button>
                            <button className="btn btn-success"
                                    onClick={() => {
                                        this.state.compounds.push({
                                            compoundProps: {
                                                compound: '-',
                                                compoundForm: undefined,
                                                dose: undefined,
                                                schedule: undefined,
                                                from: undefined,
                                                to: undefined,
                                            }
                                        })
                                        this.setState({compounds: this.state.compounds})
                                    }}
                            >Add another compound
                            </button>
                        </div>
                    </div>
                </form>

                <div className='card' style={{marginBottom: '20px'}}>
                    <div className='card-header'>Weekly Androgen Dose</div>
                    <div className='card-body'>
                        {this.state.weeklyDoses.map((dose, i) => {
                            return <p key={i}>{dose.compound} :{dose.dose} mg</p>
                        })}
                        <p>Total Weekly Dose :{this.state.totalWeeklyDose} mg</p>
                    </div>
                </div>


                <div className='card'>
                    <div className='card-header'>Rate of compound release (mg/day)</div>
                    <div className='card-body'>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={this.state.chartOptions}
                        />
                    </div>
                </div>

            </div>
        );
    }

}

export default App;
