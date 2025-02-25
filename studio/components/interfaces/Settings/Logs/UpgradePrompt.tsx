import { Button, Modal } from 'ui'

import { TIER_QUERY_LIMITS } from '.'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useFlag } from 'hooks'
import { StripeSubscription } from 'components/interfaces/Billing'
import { PRICING_TIER_PRODUCT_IDS } from 'lib/constants'

interface Props {
  show: boolean
  setShowUpgradePrompt: (value: boolean) => void
  subscription: StripeSubscription | undefined
}

const UpgradePrompt: React.FC<Props> = ({ show, setShowUpgradePrompt, subscription }) => {
  const router = useRouter()
  const { ref } = router.query

  // Team tier is enabled when the flag is turned on OR the user is already on the team tier (manually assigned by us)
  const userIsOnTeamTier = subscription?.tier?.supabase_prod_id === PRICING_TIER_PRODUCT_IDS.TEAM
  const teamTierEnabled = useFlag('teamTier') || userIsOnTeamTier

  return (
    <Modal
      hideFooter
      visible={show}
      closable
      size="medium"
      header="Log retention"
      onCancel={() => setShowUpgradePrompt(false)}
    >
      <div className="space-y-4 py-4">
        <Modal.Content>
          <div className="space-y-4">
            <p className="text-sm">
              Logs can be retained up to a duration of 3 months depending on the plan that your
              project is on.
            </p>
            <div className="border-scale-600 bg-scale-500 rounded border">
              <div className="flex items-center px-4 pt-2 pb-1">
                <p className="text-scale-1100 w-[40%] text-sm">Plan</p>
                <p className="text-scale-1100 w-[60%] text-sm">Retention duration</p>
              </div>
              <div className="py-1">
                <div className="flex items-center px-4 py-1">
                  <p className="w-[40%] text-sm">Free</p>
                  <p className="w-[60%] text-sm">{TIER_QUERY_LIMITS.FREE.text}</p>
                </div>
                <div className="flex items-center px-4 py-1">
                  <p className="w-[40%] text-sm">Pro</p>
                  <p className="w-[60%] text-sm">{TIER_QUERY_LIMITS.PRO.text}</p>
                </div>
                {teamTierEnabled && (
                  <div className="flex items-center px-4 py-1">
                    <p className="w-[40%] text-sm">Team</p>
                    <p className="w-[60%] text-sm">{TIER_QUERY_LIMITS.TEAM.text}</p>
                  </div>
                )}
                <div className="flex items-center px-4 py-1">
                  <p className="w-[40%] text-sm">Enterprise</p>
                  <p className="w-[60%] text-sm">{TIER_QUERY_LIMITS.ENTERPRISE.text}</p>
                </div>
              </div>
            </div>
          </div>
        </Modal.Content>
        <Modal.Separator />
        <Modal.Content>
          <div className="flex justify-end gap-3">
            <Button type="default" onClick={() => setShowUpgradePrompt(false)}>
              Close
            </Button>
            <Link href={`/project/${ref}/settings/billing/subscription`} passHref>
              <a>
                <Button size="tiny">Upgrade</Button>
              </a>
            </Link>
          </div>
        </Modal.Content>
      </div>
    </Modal>
  )
}

export default UpgradePrompt
