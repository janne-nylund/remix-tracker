const InputNumber = ({
  fieldName,
  labelName,
  errors,
  register,
  requirements,
  icon1,
  icon2,
}) => {
  return (
    <div>
      <input
        type="number"
        className="border-gray-200 text-gray-700 w-full p-4 pl-8 rounded-full placeholder-gray-300 shadow-8xl
        focus:outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100 peer"
        placeholder=" "
        autoComplete="off"
        id={fieldName}
        {...register(fieldName, {
          required: requirements.required,
          min: requirements.min,
        })}
      />
      {errors[fieldName] && errors[fieldName].type === "required" && (
        <span className="left-4 top-16 absolute text-xs text-red-600">
          This is required
        </span>
      )}
      {errors[fieldName] && errors[fieldName].type === "min" && (
        <span className="left-4 top-16 absolute text-xs text-red-600">
          Amount cannot be 0
        </span>
      )}
      <label htmlFor="amount" className="form-label">
        {icon1} {labelName}
      </label>
      <span className="absolute right-12 top-5 text-gray-400">{icon2}</span>
    </div>
  );
};

export default InputNumber;
