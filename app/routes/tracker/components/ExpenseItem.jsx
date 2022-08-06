import { useFetcher } from '@remix-run/react'

const ExpenseItem = ({ expense, index }) => {
    let fetcher = useFetcher()
    /* If deleting, then isDeleting === true */
    let isDeleting = fetcher.submission?.formData.get('expenseId') === expense.id

    return (
        <tr
            key={expense.id}
            /* color every other table row */
            className={`${index % 2 === 0
                ? 'bg-gray-100 hover:bg-sky-100'
                : 'hover:bg-sky-100'
                }`}
        >
            <td className={`py-3 px-4 rounded-l-full ${isDeleting ? 'text-gray-500' : null}`}>
                {!isDeleting && <span>{expense.name} {expense.obligatory && '(recurring)'}</span>}
                {isDeleting && <span>Deleting...</span>}
            </td>
            <td className='py-3 px-4'>{expense.amount} €</td>
            <td className='py-3 pr-5 mr-13 rounded-r-full'>
                {/* If expense not obligatory show delete button */}
                {!expense.obligatory && <fetcher.Form replace method='post'>
                    <input type="hidden" name='expenseId' value={expense.id} />
                    <button type='submit' name='_action' value='delete'>
                        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 stroke-gray-400 hover:stroke-red-500 cursor-pointer' fill='none' viewBox='0 0 24 24' strokeWidth={2}>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                        </svg>
                    </button>
                </fetcher.Form>}
            </td>
        </tr>
    )
}

export default ExpenseItem