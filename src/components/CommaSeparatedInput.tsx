import { convertStringToArray } from '@/utility/string';
import { Combobox } from '@headlessui/react';
import { clsx } from 'clsx/lite';
import { BiExpandVertical } from 'react-icons/bi';
import { FaCheck } from 'react-icons/fa';

export default function CommaSeparatedInput({
  onChange,
  id,
  name,
  value,
  type,
  autoCapitalize,
  readOnly,
  options: optionsRaw = [],
}: {
  value?: string
  onChange?: (value: string) => void
  options?: string[]
} & Omit<React.HTMLProps<HTMLInputElement>, 'onChange'>) {
  const lastTerm = value?.split(',').slice(-1)?.[0].trim();
  const hasLastTerm = lastTerm && !optionsRaw.includes(lastTerm);

  const items = (convertStringToArray(value) ?? [])
    .map(tag => tag.trim())
    .filter(Boolean);

  const options = items
    .filter(item => !optionsRaw.includes(item))
    .concat(optionsRaw);

  return (
    <div className="relative">
      <Combobox
        value={items}
        onChange={e => onChange?.(e.join(','))}
        multiple
      >
        <div className="relative">
          <Combobox.Input
            className="w-full !pr-16"
            onChange={e => onChange?.(e.target.value)}
            displayValue={(tags: string[]) => tags.join(', ')}
            {...{
              id,
              name,
              type,
              autoCapitalize,
              readOnly,
            }}
          />
          {options &&
            <Combobox.Button className={clsx(
              'absolute top-0 right-0 border-none !bg-transparent',
              'flex items-center',
            )}>
              <BiExpandVertical
                className="text-gray-400"
                size={16}
              />
            </Combobox.Button>}
        </div>
        {(options || hasLastTerm) &&
          <Combobox.Options className={clsx(
            'control px-1.5 absolute mt-4 w-full',
          )}>
            {hasLastTerm &&
              <Combobox.Option
                value={lastTerm}
              >
                Create {`"${lastTerm}"`}
              </Combobox.Option>}
            {options.map((tag) => (
              <Combobox.Option
                key={tag}
                value={tag}
                className={({ focus }) => clsx(
                  'p-1 rounded-[0.2rem] !hover:cursor',
                  focus && 'text-invert bg-invert',
                )}
              >
                {({ selected }) => <div className="flex items-center">
                  <span className="grow">
                    {tag}
                  </span>
                  {selected &&
                    <FaCheck size={12} className="translate-y-[1px]" />}
                </div>}
              </Combobox.Option>
            ))}
          </Combobox.Options>}
      </Combobox>
    </div>
  );
}
