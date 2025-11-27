import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="inline-block p-4 rounded-2xl bg-[#0D7AB8] mb-6">
            <Calendar className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-600">
            Sign in to continue tracking your activities
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg border-2 border-gray-200 rounded-xl",
              headerTitle: "text-2xl font-bold text-gray-900",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: "border-2 border-gray-300 hover:border-[#0D7AB8] transition-colors",
              formButtonPrimary: "bg-[#0D7AB8] hover:bg-[#0a6a9f]",
              footerActionLink: "text-[#0D7AB8] hover:text-[#0a6a9f]",
            },
          }}
        />
      </div>
    </div>
  );
}

