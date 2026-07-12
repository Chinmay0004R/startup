"""Add profile image and certificate public IDs

Revision ID: 92e8c9a4b738
Revises: 500a1d1a52f6
Create Date: 2026-07-13 00:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '92e8c9a4b738'
down_revision: Union[str, Sequence[str], None] = '500a1d1a52f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('profile_image_public_id', sa.String(length=255), nullable=True))
    op.add_column('certificates', sa.Column('public_id', sa.String(length=255), nullable=True))
    op.add_column('doctor_profiles', sa.Column('license_public_id', sa.String(length=255), nullable=True))

    try:
        op.execute(
            "UPDATE doctor_profiles SET license_public_id = license_document_public_id "
            "WHERE license_public_id IS NULL AND license_document_public_id IS NOT NULL"
        )
    except Exception:
        pass


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('doctor_profiles', 'license_public_id')
    op.drop_column('certificates', 'public_id')
    op.drop_column('users', 'profile_image_public_id')
