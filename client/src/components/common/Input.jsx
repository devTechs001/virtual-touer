export default function Input({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  id,
  ...props 
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-dark-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        className={`
          w-full px-4 py-2 border rounded-lg transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-dark-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-dark-300'}
          bg-white text-dark-900 placeholder-dark-400
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
