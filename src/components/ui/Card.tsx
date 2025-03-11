// src/components/ui/Card.tsx
export function Card({ 
    className = "", 
    children 
  }: { 
    className?: string, 
    children: React.ReactNode 
  }) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm ${className}`}>
        {children}
      </div>
    );
  }
  
  // src/components/ui/CardHeader.tsx
  export function CardHeader({ 
    title, 
    action 
  }: { 
    title: string, 
    action?: React.ReactNode 
  }) {
    return (
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        {action && <div>{action}</div>}
      </div>
    );
  }
  
  // src/components/ui/Badge.tsx
  export function Badge({ 
    children, 
    variant = "default" 
  }: { 
    children: React.ReactNode, 
    variant?: "default" | "success" | "warning" | "error" | "info"
  }) {
    const variantClasses = {
      default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    };
  
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
        {children}
      </span>
    );
  }
  
  // src/components/ui/Button.tsx
  export function Button({
    children,
    onClick,
    variant = "primary",
    className = "",
    icon
  }: {
    children: React.ReactNode,
    onClick?: () => void,
    variant?: "primary" | "secondary" | "outline",
    className?: string,
    icon?: React.ReactNode
  }) {
    const variantClasses = {
      primary: "bg-indigo-600 text-white hover:bg-indigo-700",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
      outline: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
    };
  
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${variantClasses[variant]} ${className}`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
  
  // src/components/ui/Stat.tsx
  export function Stat({ 
    label, 
    value, 
    change, 
    icon 
  }: { 
    label: string, 
    value: string, 
    change?: string, 
    icon?: React.ReactNode 
  }) {
    const changeColor = change?.startsWith('+') 
      ? 'text-emerald-600 dark:text-emerald-400' 
      : 'text-red-600 dark:text-red-400';
  
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex items-center">
          {icon && (
            <div className="flex-shrink-0 rounded-full p-3 bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300">
              {icon}
            </div>
          )}
          <div className={icon ? "ml-4" : ""}>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {label}
            </p>
            <div className="flex items-baseline">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-1">
                {value}
              </h3>
              {change && (
                <span className={`ml-2 text-sm font-medium ${changeColor}`}>
                  {change}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }