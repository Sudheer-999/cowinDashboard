import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    last7DaysList: [],
    byAgeList: [],
    byGenderList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(vaccinationDataApiUrl)

    if (response.ok === true) {
      const data = await response.json()

      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }

      const {
        last7DaysVaccination,
        vaccinationByAge,
        vaccinationByGender,
      } = updatedData

      const updated7Days = last7DaysVaccination.map(eachDay => ({
        vaccineDate: eachDay.vaccine_date,
        dose1: eachDay.dose_1,
        dose2: eachDay.dose_2,
      }))

      const updatedByAge = vaccinationByAge.map(eachItem => ({
        age: eachItem.age,
        count: eachItem.count,
      }))

      const updatedByGender = vaccinationByGender.map(eachItem => ({
        count: eachItem.count,
        gender: eachItem.gender,
      }))

      this.setState({
        last7DaysList: updated7Days,
        byAgeList: updatedByAge,
        byGenderList: updatedByGender,
        apiStatus: apiStatusConstants.success,
      })
      console.log(data)
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
      console.log('failure')
    }
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-con">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderCharts = () => {
    const {last7DaysList, byAgeList, byGenderList} = this.state

    return (
      <div>
        <VaccinationCoverage details={last7DaysList} />
        <VaccinationByGender genderDetails={byGenderList} />
        <VaccinationByAge ageDetails={byAgeList} />
      </div>
    )
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  renderViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCharts()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <div className="logo-con">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="website-logo"
          />
          <p className="logo-text">Co-WIN</p>
        </div>
        <h1 className="main-head">CoWIN Vaccination in India</h1>
        {this.renderViews()}
      </div>
    )
  }
}

export default CowinDashboard
