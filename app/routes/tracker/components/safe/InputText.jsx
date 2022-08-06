const InputText = ({
  fieldName,
  labelName,
  errors,
  register,
  requirements,
  icon,
}) => {
  return (
    <div>
      <input
        type="text"
        className="border-gray-200 text-gray-700 w-full p-4 pl-8 rounded-full placeholder-gray-300 shadow-8xl
        focus:outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100 peer"
        placeholder=" "
        autoComplete="off"
        id={fieldName}
        {...register(fieldName, {
          required: requirements.required,
          minLength: requirements.minLength,
          maxLength: requirements.maxLength,
        })}
      />
      {errors[fieldName] && errors[fieldName].type === "required" && (
        <span className="left-4 top-16 absolute text-xs text-red-600">
          This is required
        </span>
      )}
      {errors[fieldName] && errors[fieldName].type === "minLength" && (
        <span className="left-4 top-16 absolute text-xs text-red-600">
          Minimum length 4 characters
        </span>
      )}
      {errors[fieldName] && errors[fieldName].type === "maxLength" && (
        <span className="left-4 top-16 absolute text-xs text-red-600">
          Maximum length 20 characters
        </span>
      )}
      <label htmlFor={fieldName} className="form-label">
        {icon} {labelName}
      </label>
    </div>
  );
};

export default InputText;
