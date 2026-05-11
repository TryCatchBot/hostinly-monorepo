export const dynamic = "force-dynamic";
import { Suspense } from 'react';
import { SignUpForm } from '@/components/SignUpForm';


export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading signup form...</p>
        </div>
      </div>
    }>
      <SignUpForm />
    </Suspense>
  );
}
