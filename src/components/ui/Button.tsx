import type { ButtonProps } from '@/types/index'

/**
 * サイト共通の汎用ボタン。
 * トップページの「View More」リンクと同じ見た目を踏襲している。
 */
export default function Button({
  children,
  onClick,
  disabled = false,
  type = 'button',
  icon,
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group relative inline-flex w-64 cursor-pointer items-center justify-center border border-[var(--color-border)] px-6 py-4 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent ${className}`}
    >
      <span className="text-sm tracking-widest uppercase">{children}</span>
      {icon && (
        <span className="absolute right-6 flex items-center">{icon}</span>
      )}
    </button>
  )
}
