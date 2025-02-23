'use client';
import { ReactNode } from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import Image from 'next/image';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  instantMeeting?: boolean;
  image?: string;
  buttonClassName?: string;
  buttonIcon?: string;
  hasAudienceMode?: boolean;
  handleAudienceClick?: () => void;
}

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  className,
  children,
  handleClick,
  buttonText,
  image,
  buttonIcon,
  handleAudienceClick,
  hasAudienceMode = false,
}: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white">
        <DialogTitle
          className={cn('text-3xl font-bold leading-[42px]', className)}
        >
          {title}
        </DialogTitle>
        <div className="flex flex-col gap-6">
          {image && (
            <div className="flex justify-center">
              <Image src={image} alt="checked" width={72} height={72} />
            </div>
          )}
          {children}
          <Button
            className={
              'bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0'
            }
            onClick={handleClick}
          >
            {buttonIcon && (
              <Image
                src={buttonIcon}
                alt="button icon"
                width={13}
                height={13}
              />
            )}{' '}
            &nbsp;
            {buttonText || 'Schedule Meeting'}
          </Button>

          {hasAudienceMode && (
            <Button
              className={
                'bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0'
              }
              onClick={handleAudienceClick}
            >
              {buttonIcon && (
                <Image
                  src={buttonIcon}
                  alt="button icon"
                  width={13}
                  height={13}
                />
              )}{' '}
              &nbsp;
              {'Start with Audience Mode'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
