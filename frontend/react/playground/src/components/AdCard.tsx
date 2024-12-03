import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils'; // Utility for merging class names

/** Default styles for the AdCard */
const adStyles = {
    container:
        'flex flex-row max-w-full md:max-w-[60%] bg-gray-100 rounded-lg shadow-md transition-transform duration-200 ease-in-out hover:translate-y-[-3px] hover:shadow-lg overflow-hidden p-2 box-border',
    image: 'w-16 h-16 object-cover rounded-lg mr-2 self-center',
    title: 'm-0 text-gray-800 text-sm font-semibold',
    adBadge: 'rounded-lg h-fit text-sm text-gray-200 bg-gray-400 px-1',
    body: 'm-0 text-gray-600 text-xs leading-tight',
    link: 'text-gray-600 text-xs underline hover:text-gray-700 w-fit',
};

/** Props for the AdCard component */
export interface AdCardProps extends HTMLAttributes<HTMLDivElement> {
    /** URL of the ad's creative (image). */
    ad_creative: string;
    /** Title of the ad. */
    ad_title: string;
    /** Body text or description of the ad. */
    ad_body: string;
    /** Target link the ad redirects to. */
    ad_link: string;
    /** Call-to-action text for the ad link. */
    ad_link_cta: string;
    /** Function to render a custom title. */
    renderAdTitle?: (title: string) => JSX.Element;
    /** Function to render a custom body text. */
    renderAdBody?: (body: string) => JSX.Element;
    /** Optional styles override. */
    styles?: Partial<typeof adStyles>;
}

/**
 * AdCard Component
 * A reusable Ad Card component.
 *
 * @param {AdCardProps} props - Props to configure the AdCard.
 * @returns {JSX.Element} - Rendered AdCard component.
 */
const AdCard = ({
    ad_creative,
    ad_title,
    ad_body,
    ad_link,
    ad_link_cta,
    renderAdTitle,
    renderAdBody,
    styles = {},
    className,
    ...rest
}: AdCardProps): JSX.Element => {
    const mergedStyles = { ...adStyles, ...styles }; // Allowing partial override of default styles

    return (
        <div className={cn(mergedStyles.container, className)} {...rest}>
            {/* Ad Creative Image */}
            <img
                src={ad_creative}
                alt={ad_title}
                className={mergedStyles.image}
            />

            {/* Ad Content */}
            <div className="flex flex-col grow justify-between h-full box-border">
                {/* Title and Badge */}
                <div className="flex flex-row gap-2 justify-between w-full">
                    {renderAdTitle ? (
                        renderAdTitle(ad_title)
                    ) : (
                        <h2 className={mergedStyles.title}>{ad_title}</h2>
                    )}
                    <div className={mergedStyles.adBadge}>Ad</div>
                </div>

                {/* Body */}
                {renderAdBody ? (
                    renderAdBody(ad_body)
                ) : (
                    <p className={mergedStyles.body}>{ad_body}</p>
                )}

                {/* Link */}
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={ad_link}
                    className={mergedStyles.link}
                >
                    {ad_link_cta}
                </a>
            </div>
        </div>
    );
};

export default AdCard;
