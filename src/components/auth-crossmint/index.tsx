import { EmbeddedAuthForm } from "@crossmint/client-sdk-react-ui";

export function AuthCrossmint({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Auth Form */}
      <div className="flex items-center justify-center bg-gray-50 px-6 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="w-full max-w-md bg-white rounded-3xl border shadow-lg overflow-hidden">
            <EmbeddedAuthForm />
          </div>
        )}
      </div>
    </div>
  );
}