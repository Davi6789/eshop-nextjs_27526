// src/components/ui/PasswordStrength.tsx
export function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const strength = getStrength();
  const colors = {
    0: "bg-red-500",
    1: "bg-orange-500",
    2: "bg-yellow-500",
    3: "bg-blue-500",
    4: "bg-green-500",
  };

  if (password.length === 0) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i < strength ? colors[strength as keyof typeof colors] : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {strength === 4 && "Starkes Passwort"}
        {strength === 3 && "Gutes Passwort"}
        {strength === 2 && "Mittelmäßiges Passwort"}
        {strength === 1 && "Schwaches Passwort"}
      </p>
    </div>
  );
}