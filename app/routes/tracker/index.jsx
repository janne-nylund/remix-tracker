import { useLoaderData, Link, useFetcher } from '@remix-run/react'

import { json, redirect } from '@remix-run/node'

import avatar from '~/img/avatar.jpg'
import styles from "~/styles/index.css";

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import ExpenseItem from './components/ExpenseItem'
import { ListBox, InputText, InputNumber } from './components/inputComponents'
import { HouseIcon, FoodIcon, HobbyIcon, MiscIcon, InputIcon1, InputIcon2 } from './components/iconComponents'

import prisma from '~/lib/db.server'

export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export async function loader({ request }) {

  const url = new URL(request.url);
  const user = url.searchParams.get("user");

  if (user !== 'true') {
    return redirect("/")
  }

  const budgets = await prisma.budget.findMany()
  const expenses = await prisma.expense.findMany()
  return json({ budgets, expenses })
}

export const action = async ({ request }) => {
  const formData = await request.formData()
  const { ...values } = Object.fromEntries(formData)
  if (values._action === 'delete') {
    const deleteExpense = await prisma.expense.delete({
      where: {
        id: values.expenseId,
      },
    })
    console.log('DELETING: ', deleteExpense.name)
    return null
  }
  if (values._action === 'addExpense') {
    const newExpense = await prisma.expense.create({
      data: {
        name: values.name,
        amount: Number(values.amount),
        category: values.category
      },
    });
    console.log('ADDING: ', newExpense.name)
    return null
  }
  return null
}

function App() {
  const [add, setAdd] = useState(false)

  const fetcher = useFetcher()

  // this controls the ListBox selected value
  const [selected, setSelected] = useState()

  // Remix loader, action & submit data
  const { budgets, expenses } = useLoaderData()
  /* const data = useActionData() */
  //const submit = useSubmit()

  // React Hook Form
  const { reset, register, handleSubmit, formState: { errors }, control } = useForm()

  // useEffect to reset form after it is submitted/closes
  useEffect(() => {
    if (!add) {
      reset({ expenseName: '', amount: '', category: '' })
      setSelected()
    }
  }, [add, reset])

  const onSubmit = (data) => {
    /* data from React Hook Form */

    // SUBMIT HERE
    const formData = new FormData()
    formData.set('_action', 'addExpense')
    formData.set('name', data.expenseName)
    formData.set('amount', Number(data.amount))
    formData.set('category', data.category.name)
    fetcher.submit(formData, { method: "post", replace: true });
    // close form and trigger useEffect to reset
    setAdd(false)
  }

  // manually reset formfields
  const handleReset = () => {
    reset({ expenseName: '', amount: '', category: '' })
    setSelected()
  }

  // calculate total sum of expenses based on budget category 
  const calculateTotal = (budget) => {
    return expenses
      .filter((expense) => expense.category === budget)
      .reduce((acc, curr) => acc + curr.amount, 0)
  }

  // calutale total sum of all planned budget categories
  const moneyToSpend = budgets.reduce((acc, curr) => acc + curr.limit, 0)

  // calculate total sum of all expenses
  const moneySpent = budgets.reduce(
    (acc, curr) => acc + calculateTotal(curr.name),
    0
  )

  const expenseAlarm = () => {
    return moneySpent > moneyToSpend ? true : false
  }

  const month = new Date().toLocaleString('default', { month: 'long' })

  return (
    <div className='z-0 bg-gray-100 min-w-full min-h-screen mx-auto'>
      <div className='z-20 w-full bg-gradient-to-r from-sky-400 to-blue-800 h-24 flex'>
        <div className='w-full md:mx-auto md:w-10/12 lg:w-6/12 flex justify-between items-center pr-3'>
          <div className='text-white font-bold text-5xl pl-4'>
            Tracker<sup className='super'>®</sup>
          </div>
          <div className='transition-all'>
            <button
              className='bg-sky-500 hover:bg-sky-400 text-gray-100 shadow font-normal mr-4 py-2 px-2 md:px-4 rounded-full inline-flex items-center overflow-hidden'
              onClick={() => setAdd((prevAdd) => !prevAdd)}
            >
              {!add && (
                <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M12 4v16m8-8H4' />
                </svg>
              )}
              {add && (
                <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                </svg>
              )}
              <span className='ml-1 hidden md:inline'>{!add ? 'Add expense' : 'Close form'}</span>
            </button>
          </div>
        </div>
      </div>
      {add && (
        <div className='z-10 bg-white min-h-full shadow mb-3 p-10 lg:px-24 sm:w-full sm:mx-auto md:w-10/12 lg:w-6/12 bg-hero-wave2 bg-no-repeat'>
          <div className='text-sky-600 mt-4 mb-8 font-bold text-5xl text-center tracking-tight'>
            Add expense
          </div>
          <fetcher.Form replace onSubmit={handleSubmit(onSubmit)}>
            <div className='relative mb-12'>
              <InputText fieldName='expenseName' labelName='Name' errors={errors} register={register}
                requirements={{ required: true, minLength: 4, maxLength: 20 }} icon={<InputIcon1 />}
              />
            </div>
            <div className='relative mb-12'>
              <InputNumber fieldName='amount' labelName='Amount' errors={errors} register={register}
                requirements={{ required: true, min: 1 }} icon1={<InputIcon1 />} icon2={<InputIcon2 />}
              />
            </div>
            <div className='flex'>
              <ListBox selected={selected} setSelected={setSelected} control={control} errors={errors}
              />
            </div>
            <button type='submit' className='bg-sky-500 hover:bg-sky-400 text-gray-100 font-bold px-6 py-3 rounded-full inline-flex items-center'>
              Add expense
            </button>
            <button type='reset' className='bg-gray-400 hover:bg-gray-300 text-gray-100 font-bold ml-4 px-6 py-3 rounded-full inline-flex items-center'
              onClick={handleReset}>
              Reset
            </button>
          </fetcher.Form>
        </div>
      )}
      <div className='z-10 bg-white min-h-full shadow rounded sm:w-full sm:mx-auto md:w-10/12 lg:w-6/12 bg-hero-wave bg-no-repeat'>
        <div className=''>
          <div className='relative bg-hero-pillars bg-no-repeat bg-auto bg-top min-w-max h-64 md:h-96'>
            <div className='absolute top-4 right-6'>
              <span className='mx-auto hover:text-sky-500 font-bold text-xs text-center pl-4'>
                <Link to='/'>
                  <span className='text-sky-600 hover:text-sky-400'>LOGOUT</span>
                </Link>
              </span>
              <div className='relative'>
                <img alt='avatar' className='w-20 h-20 rounded-full border-[5px] border-white shadow-xl' src={avatar} />
                <span className={`absolute bottom-1 right-1 w-5 h-5 border-white border-2 
                  ${expenseAlarm() ? 'bg-red-500' : 'bg-green-500'} rounded-full`}></span>
              </div>
            </div>
          </div>
          {/* <div className='bg'>{JSON.stringify(data)}</div> */}
          <div className='text-sky-600 font-bold text-5xl px-8 lg:px-4 text-center mb-4 pt-2 tracking-tight'>
            Your monthly expenses
          </div>
          <div className='mx-auto text-center px-3 py-6 bg-gray-100 w-6/12 rounded-full text-gray-700 mb-10'>
            <span className='hidden md:inline font-bold'>
              Total for {month}:{' '}
            </span>
            <span className='font-extrabold text-sky-600'>
              <span className={`${expenseAlarm() ? 'text-red-500' : 'text-sky-600'}`}>
                {moneySpent} €
              </span>{' '}
              / {moneyToSpend} €
            </span>
          </div>
        </div>
        {budgets.map((budget) => (
          <div key={`${budget.id}${budget.name}`}
            className='sm:w-11/12 md:w-10/12 xl:w-8/12 mx-auto px-12 text-center -mt-4 pb-6 rounded-xl shadow-8xl border border-gray-100 bg-white'>
            <div className='relative flex justify-center items-center pt-6 pb-1'>
              <span className='text-sky-600 pb-4 mr-1'>
                {budget.name === 'Living' ?
                  <HouseIcon /> : budget.name === 'Food' ?
                    <FoodIcon /> : budget.name === 'Hobbies' ?
                      <HobbyIcon /> : <MiscIcon />
                }
              </span>
              <span className='text-2xl text-sky-600 font-bold pb-4 mt-1 ml-2'>
                {budget.name}
              </span>
            </div>
            <table className='table-fixed text-left min-w-full text-gray-700'>
              <thead>
                <tr className='rounded'>
                  <th className='w-2/3 px-4 py-2 text-sm text-sky-600 tracking-wider'>
                    TITLE
                  </th>
                  <th className='w-1/3 px-4 py-2 text-sm text-sky-600 tracking-wider'>
                    AMOUNT
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className='h-6 border-t'>
                  <td colSpan={3}></td>
                </tr>
                {expenses
                  .filter((expense) => expense.category === budget.name)
                  .sort((a, b) => (a.createdAt).localeCompare(b.createdAt))
                  .map((expense, index) => (
                    /* ExpenseItem as a separate component so useFetcher() hook can be used on every single instance */
                    <ExpenseItem key={expense.id} expense={expense} index={index} />
                  ))}
                <tr className='h-6 border-b'>
                  <td colSpan={3}></td>
                </tr>
                <tr>
                  <td className='p-4 font-bold text-sm'>TOTAL:</td>
                  <td colSpan={2} className='p-4 font-bold'>
                    <span className={`${calculateTotal(budget.name) / budget.limit < 0.8
                      ? 'text-teal-500 ' : 'text-red-400'}`}>
                      {calculateTotal(budget.name)}
                    </span>{' '}
                    / {budget.limit}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
        <div className='sm:w-11/12 md:w-10/12 xl:w-8/12 mx-auto px-12 text-sm text-center text-white -mt-4 pb-4 pt-2.5 shadow-8xl bg-sky-500'>
          Copyright Tracker&reg; 2022
        </div>
      </div>
    </div>
  )
}

export default App