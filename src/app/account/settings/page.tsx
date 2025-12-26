import { AccountsCard, AccountSettingsCards, AccountView, OrganizationSwitcher, ProvidersCard, SecuritySettingsCards, UpdateAvatarCard, UpdateFieldCard, UpdateNameCard, UpdateUsernameCard } from "@daveyplate/better-auth-ui"

export default function SettingsPage() {
    return (
        <div className="flex justify-center py-12 px-4 flex-1">
            <AccountSettingsCards className="max-w-xl" />
        </div>
    )
}