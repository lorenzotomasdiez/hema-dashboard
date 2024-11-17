import { ChooseCompanySection, CompanyInvitationsSection } from "@/components/sections";

export default function ChooseCompanyPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-sm mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <ChooseCompanySection />
          {/* Invitations Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Invitaciones pendientes
            </h2>
            <CompanyInvitationsSection />
          </div>
        </div>
      </div>
    </main>
  );
}
