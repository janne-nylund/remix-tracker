import { Form, useActionData } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'

import pillars from '~/img/pillars.svg'

export const action = async ({ request }) => {
  const formData = await request.formData()
  const { _action, ...values } = Object.fromEntries(formData)
  if (_action === 'login') {
    if (values.username === 'tracker' && values.password === 'track123') {
      return redirect("/tracker?user=true")
    }
    return json({ error: 'invalid username or password' })

  }
  return null
}

export default function Index() {

  const data = useActionData()

  return (
    <>
      <div className='bg-gray-100 min-w-full min-h-screen flex justify-center items-center my-auto align-middle'>
        <div className='flex flex-col justify-center items-center z-10 bg-white min-h-full shadow-xl rounded w-10/12 mx-auto md:w-8/12 lg:w-6/12 xl:w-4/12 2xl:w-4/12 bg-hero-wave bg-no-repeat py-12 align-middle'>
          <div className='flex flex-col justify-center items-center my-auto'>
            <div className='text-sky-600 font-bold text-5xl px-8 lg:px-4 text-center mb-4 pt-2 tracking-tight'>
              <img src={pillars} width='400px' alt='pillars' />
              Login to Tracker<sup className='super'>®</sup>
            </div><div className='text-sky-600 mb-6'>Username: <span className='italic font-bold'>tracker</span> | Password: <span className='italic font-bold'>track123</span></div>
            {data?.error ? <div className='text-red-500 mb-6 text-sm'>{data.error}</div> : null}
            <Form replace method='post'>
              <div className='relative mb-8'>
                <input id='usern' name='username' type='text' className='border-gray-200 text-gray-700 w-72 p-4 pl-8 rounded-full placeholder-gray-300 shadow-8xl
          focus:outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100 peer' placeholder=' ' autoComplete="off" />
                <label htmlFor='usern'
                  className='two-label'
                >Username</label>
              </div>
              <div className='relative mb-8'>
                <input type='password' id='passwd' name='password' className='border-gray-200 text-gray-700 w-72 p-4 pl-8 rounded-full placeholder-gray-300 shadow-8xl
          focus:outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100 peer' placeholder=' ' autoComplete="off" />
                <label htmlFor='passwd'
                  className='two-label'
                >Password</label>
              </div>
              <button type='submit' name='_action' value='login' className='bg-sky-500 hover:bg-sky-400 text-gray-100 font-bold px-6 py-3 rounded-full inline-flex items-center mr-6'>
                Login
              </button>
              <button type='reset' name='_action' value='login' className='bg-gray-400 hover:bg-gray-300 text-gray-100 font-bold px-6 py-3 rounded-full inline-flex items-center'>
                Reset
              </button>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}
