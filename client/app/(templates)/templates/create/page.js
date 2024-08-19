'use client';

import Square from '@/app/components/Background/Square';
import { useEffect, useState } from 'react';
import { MdCheckCircle } from 'react-icons/md';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import cn from '@/lib/cn';
import config from '@/config';
import Link from 'next/link';
import createTemplate from '@/lib/request/templates/createTemplate';
import fetchTemplateDetails from '@/lib/request/templates/fetchTemplateDetails';
import { useRouter } from 'next-nprogress-bar';
import AuthProtected from '@/app/components/Providers/Auth/Protected';
import { TbLoader } from 'react-icons/tb';
import { t } from '@/stores/language';

export default function Page() {
  const [templateId, setTemplateId] = useState('');
  const [templateDetailsLoading, setTemplateDetailsLoading] = useState(false);
  const [templateDetails, setTemplateDetails] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  useEffect(() => {
    if (templateDetails) {
      setTemplateName(templateDetails.name || '');
      setTemplateDescription(templateDetails.description || '');
    }
  }, [templateDetails]);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    t('publishTemplatePage.steps.0.title'),
    t('publishTemplatePage.steps.1.title'),
    t('publishTemplatePage.steps.2.title')
  ];
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function publishTemplate() {
    setLoading(true);
    
    toast.promise(createTemplate({
      id: templateId,
      name: templateName, 
      description: templateDescription,
      categories: selectedCategories
    }), {
      loading: t('publishTemplatePage.toast.publishingTemplate'),
      success: () => {
        router.push(`/templates/${templateId}/preview`);
        return t('publishTemplatePage.toast.templatePublished');
      },
      error: error => {
        setLoading(false);
        return error;
      }
    });
  }

  return (
    <AuthProtected>
      <div className="relative z-0 flex justify-center w-full px-6 lg:px-0">      
        <Square column='10' row='10' transparentEffectDirection='bottomToTop' blockColor='rgba(var(--bg-secondary))' />

        <div className="mt-48 mb-16 max-w-[600px] flex flex-col gap-y-2 w-full">
          <h1 className="text-4xl font-bold text-primary">
            {t('publishTemplatePage.title')}
          </h1>

          <p className="text-sm text-tertiary">
            {t('publishTemplatePage.subtitle')}
          </p>

          <div className='flex flex-col mt-6 gap-y-4'>
            <div className='flex justify-between pb-4 border-b gap-x-4 border-y-primary'>
              {steps.map((step, index) => (
                <div className='flex flex-col items-center gap-x-2' key={step}>
                  <div className='text-xs uppercase text-tertiary'>
                    STEP {index + 1}
                  </div>
                  <h2 className={cn(
                    'text-sm mobile:text-base transition-colors font-medium text-secondary flex items-center',
                    activeStep === index && 'text-primary'
                  )}>
                    {step}
                  </h2>
                </div>
              ))}
            </div>
          </div>

          {activeStep === 0 && (
            <>
              <h2 className='mt-4 text-lg font-medium sm:text-xl text-primary'>
                {t('publishTemplatePage.steps.0.inputs.templateId.title')}
              </h2>

              <p className='text-sm text-tertiary'>
                {t('publishTemplatePage.steps.0.inputs.templateId.subtitle')}
              </p>

              <input
                id='templateId'
                className='w-full px-3 py-2 text-sm rounded-lg outline-none placeholder-placeholder bg-secondary hover:bg-tertiary focus-visible:bg-quaternary focus-visible:text-secondary text-tertiary'
                type='text'
                value={templateId}
                onChange={event => setTemplateId(event.target.value)}
                placeholder={t('publishTemplatePage.steps.0.inputs.templateId.placeholder')}
                maxLength={12}
              />
            </>
          )}

          {activeStep === 1 && (
            <>
              <h2 className='mt-4 text-lg font-medium sm:text-xl text-primary'>
                {t('publishTemplatePage.steps.1.inputs.templateCategories.title')}
              </h2>

              <p className='text-sm text-tertiary'>
                {t('publishTemplatePage.steps.1.inputs.templateCategories.subtitle')}
              </p>

              <div className='flex flex-wrap items-center justify-center gap-4 mt-4'>
                {config.templateCategories
                  .filter(category => category !== 'All')
                  .map(category => (
                    <button
                      key={nanoid()}
                      className={cn(
                        'w-[100px] px-2 relative h-[100px] rounded-2xl font-semibold flex gap-x-1 items-center justify-center',
                        selectedCategories.includes(category) ? 'text-primary bg-tertiary hover:bg-quaternary' : 'bg-secondary hover:bg-tertiary',
                        selectedCategories.length >= config.templateMaxCategoriesLength && !selectedCategories.includes(category) && 'pointer-events-none opacity-70'
                      )}
                      onClick={() => {
                        if (selectedCategories.includes(category)) setSelectedCategories(selectedCategories.filter(selectedCategory => selectedCategory !== category));
                        else setSelectedCategories([...selectedCategories, category]);
                      }}
                    >
                      {t(`categories.${category}`)}
                      {selectedCategories.includes(category) && (
                        <div className='absolute top-0 left-0 flex items-center justify-center w-full h-full bg-secondary/90 rounded-2xl'>
                          <MdCheckCircle className='text-primary' />
                        </div>
                      )}
                    </button>
                  ))}
              </div>

              <label className='flex flex-col mt-6 gap-y-2' htmlFor='templateName'>
                <h2 className='text-xl font-medium text-primary'>
                  {t('publishTemplatePage.steps.1.inputs.templateName.title')}
                </h2>

                <p className='text-sm text-tertiary'>
                  {t('publishTemplatePage.steps.1.inputs.templateName.subtitle')}
                </p>
              </label>

              <input
                id='templateName'
                className='w-full px-3 py-2 text-sm rounded-lg outline-none placeholder-placeholder bg-secondary hover:bg-tertiary focus-visible:bg-quaternary focus-visible:text-secondary text-tertiary'
                type='text'
                value={templateName}
                onChange={event => setTemplateName(event.target.value)}
                placeholder={t('publishTemplatePage.steps.1.inputs.templateName.placeholder')}
                maxLength={20}
              />

              <label className='flex flex-col mt-6 gap-y-2' htmlFor='templateDescription'>
                <h2 className='text-xl font-medium text-primary'>
                  {t('publishTemplatePage.steps.1.inputs.templateDescription.title')}
                </h2>

                <p className='text-sm text-tertiary'>
                  {t('publishTemplatePage.steps.1.inputs.templateDescription.subtitle')}
                </p>
              </label>

              <textarea
                id='templateDescription'
                className='ring-0 focus:ring-2 resize-none ring-purple-500 h-[100px] scrollbar-hide w-full px-3 py-2 text-sm rounded-lg outline-none placeholder-placeholder bg-secondary hover:bg-tertiary focus-visible:bg-quaternary focus-visible:text-secondary text-tertiary'
                value={templateDescription}
                onChange={event => setTemplateDescription(event.target.value)}
                placeholder={t('publishTemplatePage.steps.1.inputs.templateDescription.placeholder', { min: config.templateDescriptionMinLength })}
                maxLength={config.templateDescriptionMaxLength}
              />
            </>
          )}

          {activeStep === 2 && (
            <>
              <h2 className='mt-2 text-lg font-medium sm:text-xl text-primary'>
                {t('publishTemplatePage.steps.2.heading')}
              </h2>

              <p className='text-sm text-tertiary'>
                {t('publishTemplatePage.steps.2.description')}
              </p>

              <div className='flex flex-col mt-4 gap-y-2'>
                <div className='flex justify-between'>
                  <h3 className='text-sm text-tertiary'>
                    {t('publishTemplatePage.steps.2.fields.categories')}
                  </h3>
                  <h3 className='text-sm text-tertiary'>
                    {selectedCategories.join(', ')}
                  </h3>
                </div>

                <div className='flex justify-between'>
                  <h3 className='text-sm text-tertiary'>
                    {t('publishTemplatePage.steps.2.fields.templateName')}
                  </h3>
                  <h3 className='text-sm text-tertiary'>
                    {templateName}
                  </h3>
                </div>

                <div className='flex justify-between'>
                  <h3 className='text-sm text-tertiary'>
                    {t('publishTemplatePage.steps.2.fields.templateDescription')}
                  </h3>
                  <p className='text-sm text-tertiary max-w-[250px] break-words'>
                    {templateDescription}
                  </p>
                </div>
              </div>

              <p className='mt-2 text-xs mobile:text-sm text-tertiary'>
                {t('publishTemplatePage.steps.2.disclaimer.content', { contentPolicyLink: <Link href='/legal/terms-of-service' className='hover:text-primary hover:underline'>{t('publishTemplatePage.steps.2.disclaimer.linkText')}</Link> })}
              </p>
            </>
          )}

          <div className='flex justify-between w-full mt-8'>
            <button className='flex items-center px-3 py-1 text-sm font-semibold text-white bg-black rounded-lg gap-x-1 dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70' onClick={() => setActiveStep(activeStep - 1)} disabled={activeStep === 0 || loading}>
              {t('buttons.back')}
            </button>

            <button 
              className='flex items-center px-3 py-1 text-sm font-semibold text-white bg-black rounded-lg gap-x-1 dark:bg-white dark:text-black dark:hover:bg-white/70 hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70' 
              onClick={async () => {
                let templateDetailsFound = false;
              
                if (activeStep === 0) {
                  setTemplateDetailsLoading(true);

                  await fetchTemplateDetails(templateId)
                    .then(data => {
                      templateDetailsFound = true;
                      setTemplateDetails(data);
                    })
                    .catch(error => {
                      templateDetailsFound = false;
                      toast.error(
                        error === 'Request failed with status code 404' ? t('publishTemplatePage.toast.templateNotFound') : error
                      );
                    })
                    .finally(() => setTemplateDetailsLoading(false));
                    
                  if (!templateDetailsFound) return;
                }

                if (activeStep === steps.length - 1) publishTemplate();
                else setActiveStep(activeStep + 1);
              }} disabled={
                activeStep === 0 ? !templateId :
                  activeStep === 1 ? (selectedCategories.length < 1 || templateName.length <= 0 || templateDescription.length < config.templateDescriptionMinLength || templateDescription.length > config.templateDescriptionMaxLength) :
                    ((loading === true || templateDetailsLoading) || false)
              }
            >
              {activeStep === steps.length - 1 ? t('buttons.publish') : t('buttons.next')}
              
              {(loading || templateDetailsLoading) && (
                <TbLoader className='animate-spin' />
              )}
            </button>
          </div>
        </div>
      </div>
    </AuthProtected>
  );
}