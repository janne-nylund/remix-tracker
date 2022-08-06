import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

import { Controller } from "react-hook-form";

const categories = [
  { name: 'Living' },
  { name: 'Food' },
  { name: 'Hobbies' },
  { name: 'Misc.' },
]

const ListBox = ( { control, errors, selected, setSelected } ) => {
  

  return (
    <div className="w-80 mb-12">
      <Controller
          control={control}
          defaultValue={selected}
          name="category"
          rules={{ required: true }}
          render={({ field: { onChange } }) =>  (
            <Listbox
              as="div"
              className="space-y-1"
              value={selected}
              onChange={(e) => {
                onChange(e);
                setSelected(e);
              }}
            >
          <Listbox.Label className="relative">
            <div className={`absolute w-80 transition-all ${selected ? 'z-50 text-xs -top-7 left-4 text-sky-500' : 'text-base text-gray-400 left-4 top-4 text-transparent'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg> Select Category
            </div>
          </Listbox.Label>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full p-4 pl-3 pr-10 text-left bg-white border border-gray-200 rounded-full shadow-8xl cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
            <span className={`pl-1.5 block truncate ${selected ? 'text-gray-600 py-[3px]' : 'text-gray-400 text-base'}`}>{selected ? selected.name : 
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg> Select Category
            </div>
            }
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="w-5 h-5 text-gray-600"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-lg shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {categories.map((category, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `cursor-default select-none relative py-2 pl-10 pr-4 ${
                      active ? 'text-sky-700 bg-sky-100' : 'text-gray-600'
                    }`
                  }
                  value={category}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {category.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
        </Listbox>
          )}
          />
      {errors.category && errors.category.type === "required" && <span className="pl-4 text-xs text-red-600">Please choose a category</span>}
    </div>
  )
}

export default ListBox
