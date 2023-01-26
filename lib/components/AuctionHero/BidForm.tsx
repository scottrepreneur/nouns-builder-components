import React, { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils.js';
import { usePrepareContractWrite, useContractWrite, useAccount } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import { AuctionABI } from '../../abis';

export const BidForm = ({ tokenId, formData, dao }: any) => {
	const { isConnected } = useAccount();

	const { config } = usePrepareContractWrite({
		address: dao.contracts.auction as `0x${string}`,
		chainId: dao.chainId,
		abi: AuctionABI,
		functionName: 'createBid',
		args: [BigNumber.from(String(tokenId))],
		enabled: !formData.btn.disabled,
		overrides: {
			value: parseEther(formData.input.value || '0'),
		},
		onError(err) {
			console.error(err);
		},
	});

	const { write } = useContractWrite(config);

	const placeBid = (event: any) => {
		event.preventDefault();
		write?.();
	};

	return (
		<>
			<form onSubmit={placeBid} className="mt-12 sm:mt-6 flex flex-col sm:flex-row gap-5 w-full">
				{!isConnected ? (
					<ConnectKitButton.Custom>
						{({ show }) => {
							return (
								<button
									onClick={show}
									type="button"
									className={`text-white bg-purple-700 hover:bg-blue-800 rounded-lg text-xl px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 flex-shrink-0 w-full`}
								>
									Connect wallet
								</button>
							);
						}}
					</ConnectKitButton.Custom>
				) : (
					<>
						<div className="relative mb-2 w-full flex-grow">
							<span className="text-lg absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
								Ξ
							</span>
							<input
								className="text-2xl shadow appearance-none border rounded-lg w-full py-4 pl-7 px-4 text-gray-700 leading-tight focus:shadow-outline"
								{...formData.input}
							/>
						</div>

						<button
							type="submit"
							className={`text-white bg-purple-700 hover:bg-blue-800 rounded-lg text-xl px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:bg-gray-500 disabled:dark:bg-grey-500 disabled:cursor-not-allowed disabled:pointer-events-none flex-shrink-0`}
							{...formData.btn}
						>
							Place bid
						</button>
					</>
				)}
			</form>

			{isConnected && (
				<button
					onClick={formData.addMinBid}
					type="button"
					className="text-sm text-gray-500 transition-all hover:text-black"
				>
					Enter minimum bid
				</button>
			)}
		</>
	);
};
