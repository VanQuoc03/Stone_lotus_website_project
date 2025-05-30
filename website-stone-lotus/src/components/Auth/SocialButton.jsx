

const SocialButton = ({ label, icon, onClick, className = "" }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex justify-center items-center gap-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 px-4 py-2 text-sm ${className}`}
    >
      {icon}
      {label}
    </button>
  )
}

export default SocialButton
