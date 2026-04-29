import { useQuery } from '@apollo/client/react';

import { GroupBy } from '@/constants/salesDynamics';
import { SALES_DYNAMICS_QUERY } from '@/services/graphql/statisticsAdminService';
import type {
  SalesDynamicsData,
  SalesDynamicsVars,
} from '@/types/salesDynamics';

export { GroupBy };

export const useSalesDynamics = (vars: SalesDynamicsVars | null) => {
  return useQuery<SalesDynamicsData, SalesDynamicsVars>(SALES_DYNAMICS_QUERY, {
    variables: vars ?? {
      productIds: [],
      from: '',
      to: '',
      groupBy: GroupBy.WEEK,
    },
    skip: !vars || vars.productIds.length === 0,
  });
};
