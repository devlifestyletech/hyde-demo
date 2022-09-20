import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../../../components/Header'
import { getAllReserves } from '../services'
import './styles/main.css'

export default function ListsPage () {
  const { reserves } = useSelector(
    (state) => state.FacilitiesManagementReducer)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllReserves())
  }, [])

  return (
    <>
      <Header title='Reservation Lists' />

    </>
  )
}
