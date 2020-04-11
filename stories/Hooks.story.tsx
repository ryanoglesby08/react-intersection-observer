import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { IntersectionOptions, useInView } from '../src/index'
import ScrollWrapper from './ScrollWrapper/index'
import { CSSProperties } from 'react'
import { withKnobs, number, boolean, text } from '@storybook/addon-knobs'
import Status from './Status'

type Props = {
  style?: Object
  children?: React.ReactNode
  noStatus?: boolean
  options?: IntersectionOptions
}

const sharedStyle: CSSProperties = {
  display: 'flex',
  minHeight: '25vh',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  background: '#148bb4',
  color: 'azure',
  transition: 'opacity 0.5s',
}

function getOptions(
  options: IntersectionOptions = { threshold: 0, triggerOnce: false },
) {
  const { threshold, triggerOnce, rootMargin } = options
  return {
    ...options,
    threshold:
      options && Array.isArray(threshold)
        ? threshold
        : number('Threshold', (threshold as number) || 0, {
            range: true,
            min: 0,
            max: 1,
            step: 0.1,
          }),
    rootMargin: text('Root margin', rootMargin || ''),
    triggerOnce: boolean('Trigger once', triggerOnce || false),
  }
}

const LazyHookComponent = ({
  options,
  style,
  children,
  noStatus,
  ...rest
}: Props) => {
  const [ref, inView, entry] = useInView(getOptions(options))
  const [isLoading, setIsLoading] = React.useState(true)
  action('Inview')(inView, entry)

  React.useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div
      ref={ref}
      data-inview={inView}
      style={{
        ...sharedStyle,
        ...style,
        opacity: inView ? 1 : 0.5,
      }}
      {...rest}
    >
      {!noStatus && <Status inView={inView} />}
      <h2>
        {children || 'Inside the viewport'}: {inView.toString()}
      </h2>
    </div>
  )
}
const HookComponent = ({
  options,
  style,
  children,
  noStatus,
  ...rest
}: Props) => {
  const [ref, inView, entry] = useInView(getOptions(options))
  action('Inview')(inView, entry)

  return (
    <div
      ref={ref}
      data-inview={inView}
      style={{
        ...sharedStyle,
        ...style,
        opacity: inView ? 1 : 0.5,
      }}
      {...rest}
    >
      {!noStatus && <Status inView={inView} />}
      <h2>
        {children || 'Inside the viewport'}: {inView.toString()}
      </h2>
      <pre style={{ textAlign: 'left' }}>
        {JSON.stringify(options, null, 2)}
      </pre>
    </div>
  )
}

storiesOf('useInView hook', module)
  .addDecorator(withKnobs)

  .add('Basic', () => (
    <ScrollWrapper>
      <HookComponent />
    </ScrollWrapper>
  ))
  .add('Lazy Hook rendering', () => (
    <ScrollWrapper>
      <LazyHookComponent />
    </ScrollWrapper>
  ))
  .add('Start in view', () => <HookComponent />)
  .add('Taller then viewport', () => (
    <ScrollWrapper>
      <HookComponent style={{ height: '150vh' }} />
    </ScrollWrapper>
  ))
  .add('With threshold 100%', () => (
    <ScrollWrapper>
      <HookComponent options={{ threshold: 1 }}>
        Header is fully inside the viewport
      </HookComponent>
    </ScrollWrapper>
  ))
  .add('With threshold 50%', () => (
    <ScrollWrapper>
      <HookComponent options={{ threshold: 0.5 }}>
        Header is 50% inside the viewport
      </HookComponent>
    </ScrollWrapper>
  ))
  .add('Taller then viewport with threshold 100%', () => (
    <ScrollWrapper>
      <HookComponent options={{ threshold: 1 }} style={{ height: '150vh' }}>
        Header is fully inside the viewport
      </HookComponent>
    </ScrollWrapper>
  ))
  .add('Multiple thresholds', () => (
    <ScrollWrapper>
      <HookComponent
        options={{ threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
        style={{ height: '150vh' }}
      >
        Header is fully inside the viewport
      </HookComponent>
    </ScrollWrapper>
  ))
  .add('Trigger once', () => (
    <ScrollWrapper>
      <HookComponent options={{ triggerOnce: true }} />
    </ScrollWrapper>
  ))
  .add('With root margin', () => (
    <ScrollWrapper>
      <HookComponent
        options={{ rootMargin: '500px 0px' }}
        style={{ height: 500 }}
        noStatus
      />
      <HookComponent
        options={{ rootMargin: '500px 0px' }}
        style={{ height: 500, background: '#4a8f72' }}
        noStatus
      />
      <HookComponent
        options={{ rootMargin: '500px 0px' }}
        style={{ height: 500, background: '#4a638f' }}
        noStatus
      />
      <HookComponent
        options={{ rootMargin: '500px 0px' }}
        style={{ height: 500, background: '#8f4a62' }}
        noStatus
      />
    </ScrollWrapper>
  ))
  .add('Negative root margin', () => (
    <ScrollWrapper>
      <HookComponent
        options={{ rootMargin: '-500px 0px' }}
        style={{ height: 500 }}
        noStatus
      />
      <HookComponent
        options={{ rootMargin: '-500px 0px' }}
        style={{ height: 500, background: '#4a8f72' }}
        noStatus
      />
      <HookComponent
        options={{ rootMargin: '-500px 0px' }}
        style={{ height: 500, background: '#4a638f' }}
        noStatus
      />
      <HookComponent
        options={{ rootMargin: '-500px 0px' }}
        style={{ height: 500, background: '#8f4a62' }}
        noStatus
      />
    </ScrollWrapper>
  ))
