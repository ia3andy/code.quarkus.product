import React, { useEffect, useState } from 'react';
import { generateProject, newDefaultProject, resolveInitialProject, resolveInitialFilterQueryParam, Target } from '../api/quarkus-project-utils';
import { useAnalytics } from '../../core/analytics';
import { CodeQuarkusForm } from './quarkus-project-edition-form';
import { LoadingModal } from '../modals/loading-modal';
import { NextStepsModal } from '../modals/next-steps-modal';
import { ExtensionEntry } from '../pickers/extensions-picker';
import { CodeQuarkusProps } from '../code-quarkus';
import { ErrorModal } from '../modals/error-modal';
import { QuarkusProject } from '../api/model';

enum Status {
  EDITION = 'EDITION', RUNNING = 'RUNNING', ERROR = 'ERROR', DOWNLOADED = 'DOWNLOADED'
}

interface RunState {
  status: Status;
  result?: any;
  error?: any;
}

interface QuarkusProjectFlowProps extends CodeQuarkusProps {
  extensions: ExtensionEntry[];
}

export function QuarkusProjectFlow(props: QuarkusProjectFlowProps) {
  const [filterQuery] = useState<string>(resolveInitialFilterQueryParam());
  const [project, setProject] = useState<QuarkusProject>(resolveInitialProject(props.extensions));
  const [run, setRun] = useState<RunState>({ status: Status.EDITION });
  const analytics = useAnalytics();

  const generate = (target: Target = Target.DOWNLOAD) => {
    if (run.status !== Status.EDITION) {
      console.error(`Trying to generate an application from the wrong status: ${run.status}`);
      return;
    }
    if (target !== Target.DOWNLOAD) {
      setRun({ status: Status.RUNNING });
    }
    analytics.event('UX', 'Generate application', target);
    generateProject(props.config.environment, project, target).then((result) => {
      setRun((prev) => ({ ...prev, result, status: Status.DOWNLOADED }));
    }).catch((error: any) => {
      setRun((prev) => ({ status: Status.ERROR, error }));
    });
  };

  useEffect(() => {
    if (project.github) {
      generate(Target.GITHUB);
    }
    // eslint-disable-next-line
  }, []);

  const closeModal = (resetProject = true) => {
    setRun({ status: Status.EDITION });
    if (resetProject) {
      setProject(newDefaultProject());
    }
  };

  return (
    <React.Fragment>
      <CodeQuarkusForm project={project} setProject={setProject} config={props.config} onSave={generate} extensions={props.extensions} filterParam={filterQuery}/>
      {!run.error && run.status === Status.RUNNING && (
        <LoadingModal/>
      )}
      {!run.error && run.status === Status.DOWNLOADED && (
        <NextStepsModal onClose={closeModal} result={run.result} buildTool={project.metadata.buildTool} extensions={project.extensions}/>
      )}
      {run.error && (
        <ErrorModal onClose={() => closeModal(false)} error={run.error}/>
      )}
    </React.Fragment>
  );

}
