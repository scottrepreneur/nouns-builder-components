import React, { useEffect, useState } from 'react';
import { ComponentConfig, ProposalData } from '../types';
import { useProposals } from '../hooks';
import ComponentWrapper from './ComponentWrapper';
import { ProposalListItem } from './ProposalListItem';

export const ProposalList = ({ dao, opts = {} }: ComponentConfig) => {
	const theme = opts?.theme;
	const sortDirection = opts?.sortDirection?.toUpperCase() || 'DESC';
	const maxProposals = Number(opts?.max) || 10;

	const props = useProposals(dao);

	const [proposals, setProposals] = useState<ProposalData[]>([]);

	useEffect(() => {
		if (props.length) {
			if (sortDirection === 'ASC') {
				const sorted = [...props].sort((a, b) => a.created - b.created);
				setProposals(sorted);
			} else setProposals(props);
		}
	}, [props, sortDirection]);

	return (
		<ComponentWrapper theme={theme}>
			<div id="proposal-list" className="flex flex-col gap-6">
				{proposals?.map((proposal, i) => {
					if (maxProposals && i >= maxProposals) return null;
					return <ProposalListItem key={proposal.id} dao={dao} proposal={proposal} />;
				})}
			</div>
		</ComponentWrapper>
	);
};
