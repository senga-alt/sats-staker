import { Dashboard } from '@/components/dashboard/dashboard';
import { StakeOverview } from '@/components/dashboard/stake-overview';
import { RewardsChart } from '@/components/dashboard/rewards-chart';
import { StakeActions } from '@/components/dashboard/stake-actions';
import { WalletRequired } from '@/components/wallet-required';

export default function DashboardPage() {
  return (
    <WalletRequired>
      <Dashboard>
        <StakeOverview />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <RewardsChart />
          </div>
          <div className="lg:col-span-1">
            <StakeActions />
          </div>
        </div>
      </Dashboard>
    </WalletRequired>
  );
}